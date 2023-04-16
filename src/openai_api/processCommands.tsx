import { Message, iterableStreamGPT4Message } from './gpt4';

export interface Command {
    type: string;
    parameters: { [key: string]: string };
    partial: boolean;
}


export async function* processCommands(messages: Message[]): AsyncIterable<Command> {
    let raw = "";

    for await (const resp of iterableStreamGPT4Message(messages)) {
        let token = resp.token;
        raw += token;

        // Process any commands
        const [newRaw, newCommands] = getCommands(raw);
        raw = newRaw;

        for (const command of newCommands) {
            yield command;
        }
    }
}
export default processCommands;


export const getCommands = (input: string): [string, Command[]] => {
    const lines = input.split('\n');
    const commands: Command[] = [];

    while (lines.includes('EndCommand')) {
        const commandIndex = lines.indexOf('Command');
        const endCommandIndex = lines.indexOf('EndCommand');

        const commandLines = lines.slice(commandIndex, endCommandIndex + 1);
        const command = readCommand(commandLines);

        if (command) {
            console.log('Adding command:', JSON.stringify(command));
            command.partial = false;
            commands.push(command);
        }

        lines.splice(0, endCommandIndex + 1);
    }

    // Read the rest as a partial command
    if (lines.length > 0) {
        const command = readCommand(lines);
        if (command) {
            console.log('Adding partial command:', command);
            command.partial = true;
            commands.push(command);
        }
    }

    return [lines.join('\n').trimStart(), commands];
};

export const readCommand = (lines: string[]): Command | null => {
    // Command is partial if there's still an EndCommand in the lines
    const isPartial: boolean = lines.includes('EndCommand');

    if (lines.length < 2) {
        return null;
    }

    const commandName = lines[1].toUpperCase();
    const parameters: { [key: string]: string; } = {};

    // let paramName = '';
    // let isMultilineValue = false;
    // let multilineValue = '';

    // for (let i = 2; i < lines.length - 1; i++) {
    //     const line = lines[i];

    //     if (line === '---') {
    //         // Either starting or ending a multiline value
    //         isMultilineValue = !isMultilineValue;
    //         if (!isMultilineValue) {
    //             parameters[paramName] = multilineValue.trim();
    //             multilineValue = '';
    //         }
    //     } else if (isMultilineValue) {
    //         // Reading a new line of a multiline value
    //         multilineValue += line + '\n';
    //         parameters[paramName] = multilineValue.trim();
    //     } else {
    //         // Reading a new parameter
    //         paramName = line;
    //         if (!lines[i + 1].startsWith('---')) {
    //             parameters[paramName] = lines[++i];
    //         }
    //     }
    // }

    let state: ('PARAM_NAME' | 'PARAM_VALUE' | 'MULTILINE_VALUE') = 'PARAM_NAME';
    let paramName = '';
    let paramValue = '';

    for (let i = 2; i < lines.length; i++) {
        const line = lines[i];

        // console.log({
        //     i,
        //     state,
        //     paramName,
        //     paramValue,
        //     line
        // });

        switch (state) {
            case 'PARAM_NAME':
                paramName = line;
                state = 'PARAM_VALUE';
                break;
            case 'PARAM_VALUE':
                if (line === '---') {
                    state = 'MULTILINE_VALUE';
                } else {
                    parameters[paramName] = line;
                    state = 'PARAM_NAME';
                }
                break;
            case 'MULTILINE_VALUE':
                // Update the value with the new contents of this line (or add a new line
                // if a new line has come in)
                if (line === '---') {
                    parameters[paramName] = paramValue.trim();
                    paramValue = '';
                    state = 'PARAM_NAME';
                } else {
                    paramValue += line + '\n';
                    parameters[paramName] = paramValue.trim();
                }
                break;
        }
    }

    return {
        type: commandName,
        parameters,
        partial: isPartial
    };
};
