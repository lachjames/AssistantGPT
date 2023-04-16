
export enum GPT4CommandType {
    STATE = 'STATE',
    SAY = 'SAY',
    ASK = 'ASK',
    ROLL = 'ROLL',
    ROLLKH = 'ROLLKH',
    ROLLKL = 'ROLLKL',
    USER_INPUT = 'USER_INPUT',
    CREATE_NPC = 'CREATENPC',
    SET_SCENE = 'SETSCENE',
}

export interface GPT4Command {
    type: GPT4CommandType;
    title: string;
    parameters: { [key: string]: string };
    // content: string;
    // characterName?: string;
}

export const getCommands = (input: string, done: boolean, addCommand: any): string => {
    // console.log("Processing:", input);
    // Split by newline
    const lines = input.split('\n');

    // Iterate while EndCommand is in the string
    while (lines.includes('EndCommand')) {
        // Get the index of the first EndCommand
        const commandIndex = lines.indexOf('Command');
        const endCommandIndex = lines.indexOf('EndCommand');

        // Read the command
        const commandLines = lines.slice(commandIndex, endCommandIndex + 1);
        const command = readCommand(commandLines);

        // Add the command
        console.log("Adding command:", command);
        addCommand(command);

        // Remove the command from the input
        lines.splice(0, endCommandIndex + 1);
    }

    // Return the remaining string
    return lines.join('\n');
};

export const readCommand = (lines: string[]): GPT4Command => {
    const commandName = lines[1].toUpperCase() as GPT4CommandType;
    const parameters: { [key: string]: string; } = {};

    let paramName = '';
    let isMultilineValue = false;
    let multilineValue = '';

    for (let i = 2; i < lines.length - 1; i++) {
        const line = lines[i];

        if (line === '---') {
            isMultilineValue = !isMultilineValue;
            if (!isMultilineValue) {
                parameters[paramName] = multilineValue.trim();
                multilineValue = '';
            }
        } else if (isMultilineValue) {
            multilineValue += line + '\n';
        } else {
            paramName = line;
            if (!lines[i + 1].startsWith('---')) {
                parameters[paramName] = lines[++i];
            }
        }
    }

    return {
        type: commandName as GPT4Command['type'],
        parameters: parameters,
        title: commandName,
    };
};
