import { SYSTEM_MESSAGE } from '../prompts';
import { Message, streamGPT4Message } from '../../openai_api/gpt4';
import { GPT4Command, GPT4CommandType, getCommands } from "../commands/processCommands";
import { useGameState, countTokens, DIRECT_TOKEN_LIMIT, STATE_TOKEN_LIMIT, TOKENIZER, PROMPT_SUFFIX } from './state';


export class AnnotatedMessage {
    message: Message;
    commands: GPT4Command[];
    constructor(message: Message, commands: GPT4Command[]) {
        this.message = message;
        this.commands = commands;
    }

    getText() {
        return this.message.content;
    }

    getState(): GPT4Command[] {
        // const state = this.commands.find((command) => command.type === GPT4CommandType.STATE);
        // if (!state) {
        //     return null;
        // }
        // // return state.content;
        // return state.parameters.changes;

        // Find all state commands
        const states = this.commands.filter((command) => command.type === GPT4CommandType.STATE);
        return states;
    }
}
export class MessageHistory {
    messages: AnnotatedMessage[];
    constructor() {
        this.messages = [];
    }

    addMessage(message: Message, requiresResponse: boolean = false) {
        // Get message commands
        const commands: GPT4Command[] = [];
        getCommands(message.content, true, (command: GPT4Command) => {
            commands.push(command);
        });

        const annotatedMessage = new AnnotatedMessage(message, commands);
        this.messages.push(annotatedMessage);
        if (requiresResponse) {
            this.getResponse();
        }
    }

    getMessages() {
        return this.messages;
    }

    async getResponse() {
        // Wait 100ms to be sure everything else has updated
        await new Promise((resolve) => setTimeout(resolve, 100));

        const { addAssistantMessage, setProcessing, addCommand } = useGameState.getState();
        console.log("Calling GPT-4:", this.messages);
        // Call the API and get the response
        let cur = "";
        streamGPT4Message(this.package(), (token: string, whole: string, done: boolean) => {
            cur += token;

            // Split cur by newline and check for commands
            cur = getCommands(cur, done, addCommand);
            if (done) {
                console.log("Response: ", whole);
                addAssistantMessage(whole);
                setProcessing(false);
            }
        });
    }

    package(): Message[] {
        // Get the system message
        const { username, character } = useGameState.getState();

        // Construct the state message
        let stateMessage = {
            role: 'assistant',
            content: '',
        };

        // Header for the state message
        stateMessage.content += "--- Character Information ---:\n";

        // Character state information
        stateMessage.content += `${username} is playing "${character.name}"\n`;
        stateMessage.content += `    Backstory: ${character.backstory}\n`;
        stateMessage.content += `    Goal: ${character.goal}\n`;
        stateMessage.content += `    Strength: ${character.strength}\n`;
        stateMessage.content += `    Weakness: ${character.weakness}\n`;
        stateMessage.content += "\n";

        // Add the messages
        stateMessage.content += "--- Previous Events ---:\n";

        let i = this.messages.length - 1;

        const directMessages = [];
        let directMessageTokens = 0;
        const stateTexts = [];

        // Read direct messages until we hit the token limit
        while (i >= 0) {
            const message = this.messages[i].message;
            let msg = "";
            switch (message.role) {
                case 'assistant':
                    msg = "Assistant:\n" + message.content + '\n';
                    break;
                case 'user':
                    msg = "User:\n" + message.content + '\n';
                    break;
                default:
                    throw new Error("Invalid message role: " + message.role);
            }

            const msg_tokens = countTokens(msg);

            if (directMessageTokens + msg_tokens < DIRECT_TOKEN_LIMIT) {
                // Add the message (first to the array, so it's in the right order)
                directMessages.unshift(msg);
                directMessageTokens += msg_tokens;
            }
            else {
                break;
            }

            // Move to the previous message
            i--;
        }

        // Read the rest of the messages into the state
        while (i >= 0) {
            const states: GPT4Command[] = this.messages[i].getState();
            if (states) {
                // Add the state message
                for (const state of states.reverse()) {
                    stateTexts.unshift(state.parameters.changes);
                }
            }
            i--;
        }

        let stateTokenTotal = stateTexts.reduce((a, b) => a + countTokens(b), 0);

        console.log(`Direct message tokens: ${directMessageTokens} / ${DIRECT_TOKEN_LIMIT}`);
        console.log(`State text tokens: ${stateTokenTotal} / ${STATE_TOKEN_LIMIT}`);

        // Randomly remove state messages until we are under the token limit
        // Pre-compute the token counts for each state message to avoid recomputing
        const stateTokenCounts = stateTexts.map((text) => countTokens(text));
        while (stateTokenTotal > STATE_TOKEN_LIMIT) {
            // Pick a random state message to remove
            const index = Math.floor(Math.random() * stateTexts.length);
            const tokenCount = stateTokenCounts[index];
            stateTokenCounts.splice(index, 1);
            stateTexts.splice(index, 1);

            // Update the token count
            stateTokenTotal -= tokenCount;
        }

        // Add the state messages
        stateTexts.forEach((text) => {
            stateMessage.content += text + "\n";
        });

        // Add the direct messages
        stateMessage.content += "--- Message History ---\n";
        directMessages.forEach((msg, index) => {
            stateMessage.content += "--- Message ---\n";
            stateMessage.content += msg;
            stateMessage.content += "--- End Message ---\n";
        });

        const systemMessage = {
            role: 'system',
            content: SYSTEM_MESSAGE
        };

        stateMessage.content += "--- End Message History ---\n";

        // Add the prompt
        stateMessage.content += "\n";
        stateMessage.content += PROMPT_SUFFIX;

        console.log("State message:", stateMessage);
        return [
            systemMessage,
            stateMessage,
        ];
    }
}
