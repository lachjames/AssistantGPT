import { getCommands } from "./processCommands";

const commandText = `
Command
State
characterName
Lachlan
changes
Lachlan has just started his journey to uncover ancient Jedi secrets and defeat the dark side.
EndCommand

Command
SetScene
sceneName
Jedi Temple Ruins
location
The ruins of an ancient Jedi Temple on a remote planet
music
Mysterious and ambient
environmentalNoise
Soft wind and distant wildlife sounds
EndCommand

Command
Say
speakerName
Narrator
text
You find yourself standing in the ruins of an ancient Jedi Temple on a remote planet. The wind whispers through the crumbling stone structures, and the distant sounds of wildlife echo through the air. As a Jedi Sentinel, you've come here to uncover ancient Jedi secrets and prove your worth to the Jedi Order. What would you like to do?
EndCommand

Command
Ask
characterName
Lachlan
question
What do you want to do in the Jedi Temple Ruins?
EndCommand
`.trim();

const commandList: any[] = [];
getCommands(commandText, false, (command: any) => {
    commandList.push(command);
});

for (let command of commandList) {
    console.log(command);
}