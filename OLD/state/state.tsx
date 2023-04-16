import { create } from 'zustand';
import GPT3Tokenizer from 'gpt3-tokenizer';
import { MessageHistory } from './MessageHistory';
import { GPT4CommandType, GPT4Command } from './../commands/processCommands';
import { AudioManager } from './AudioManager';
import { ImageManager } from './ImageManager';
import { CharacterState, NPCState } from './objects';

export const TOKENIZER = new GPT3Tokenizer({ type: 'gpt3' });
export const DIRECT_TOKEN_LIMIT = 1024;
export const STATE_TOKEN_LIMIT = 2048;

export const countTokens = (text: string) => {
    const { bpe } = TOKENIZER.encode(text)
    console.log(`${bpe.length} tokens for:\n${text}`);
    return bpe.length;
}

export const PROMPT_SUFFIX = `
Please provide your response, in the form of one or more commands as described in the system message.

Ensure you use the following format for commands:
Begin Command
Name
Character
{Content}
End Command

Remember that your last command must be a State command, and only your second-last command can (and should) be a query command (ASK, ROLL, ROLLKH, ROLLKL).

Remember that the user cannot see the State command, so if there are things within it you want them to know, you need to say them in a later command, such as a SAY command.
`.trim();

interface GameState {
    // Variables
    processing: boolean;
    username: string;
    commands: GPT4Command[];
    npcs: { [key: string]: NPCState };

    // Managers
    audioManager: AudioManager;
    imageManager: ImageManager;
    messageHistory: MessageHistory;
    character: CharacterState;

    // Views
    currentSceneImage: HTMLImageElement | null;
    currentNPC: NPCState | null;

    // Methods
    setCharacter: (character: CharacterState) => void;
    updateCharacter: ((update_fn: (character: CharacterState) => void) => void);
    setProcessing: (processing: boolean) => void;
    addCommand: (command: GPT4Command) => void;
    addAssistantMessage: (message: string) => void;
    sendUserMessage: (message: string, requiresResponse: boolean) => void;
    // setMessages: (messages: Message[]) => void;
    setUsername: (username: string) => void;
    setCurrentSceneImage: (image: HTMLImageElement | null) => void;
    setCurrentNPC: (npc: NPCState | null) => void;
}


export const useGameState = create<GameState>((set) => ({
    // Variables
    processing: false,
    username: "Lachlan",
    commands: [],
    npcs: {},

    // Managers
    messageHistory: new MessageHistory(),
    audioManager: new AudioManager(),
    imageManager: new ImageManager(),
    character: {
        name: "Zaylen Kestra",
        backstory: "A human male Jedi Sentinel, was once a promising Padawan but was cast out of the Jedi Order due to his unorthodox methods and thirst for knowledge.",
        goal: "Seeks to prove his worth and rejoin the Jedi Order by uncovering ancient Jedi secrets and defeating the dark side.",
        strength: "His strength lies in his exceptional adaptability and resourcefulness, allowing him to excel in various situations.",
        weakness: "His insatiable curiosity and willingness to bend the rules often lead him into dangerous situations and conflicts with authority.",
    } as CharacterState,

    // Views
    currentSceneImage: null,
    currentNPC: null,

    // Methods
    setCharacter: (character: CharacterState) => set({ character }),
    updateCharacter: (update_fn: (character: CharacterState) => void) => set((state) => {
        update_fn(state.character);
        return { character: state.character };
    }),
    setProcessing: (processing: boolean) => set({ processing }),
    setUsername: (username: string) => set({ username }),
    addCommand: (command: GPT4Command) => {
        if (command.type === GPT4CommandType.CREATE_NPC) {
            const npc = new NPCState(
                command.parameters.characterName,
                command.parameters.backstory,
                command.parameters.goal,
                command.parameters.strength,
                command.parameters.weakness,
                command.parameters.disposition,
                command.parameters.voice,
            );
            console.log("Created NPC:", npc, "from command:", command);

            set((state) => ({
                npcs: {
                    ...state.npcs,
                    [npc.name]: npc,
                }
            }));
        }
        set((state) => ({
            commands: [...state.commands, command],
        }))
    },
    addAssistantMessage: (message: string) => {
        set((state) => {
            state.messageHistory.addMessage({ role: "assistant", content: message });
            return { messageHistory: state.messageHistory };
        });
    },
    sendUserMessage: (message: string, requiresResponse: boolean = false) => {
        set((state) => {
            state.messageHistory.addMessage(
                { role: "user", content: message },
                requiresResponse
            );
            return { messageHistory: state.messageHistory };
        });
    },
    setCurrentSceneImage: (image: HTMLImageElement | null) => set({ currentSceneImage: image }),
    setCurrentNPC: (npc: NPCState | null) => set({ currentNPC: npc }),
}));