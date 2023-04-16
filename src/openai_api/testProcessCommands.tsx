import { processCommands } from './processCommands'

const SYSTEM_MESSAGE = `
You are a test AI who always responds with the following text (excluding the --- BEGIN TEXT --- and --- END TEXT --- lines):

--- BEGIN TEXT ---
Command
Say
Person
Lachlan
Message
Hello
EndCommand
--- END TEXT ---

Remember to not include the --- BEGIN TEXT --- and --- END TEXT --- lines in your response.

Output the response three times in a row in your message.
`

async function test() {
    const messages = [
        { role: "system", content: SYSTEM_MESSAGE },
        { role: "user", content: "Hi there!" }
    ];

    for await (const x of processCommands(messages)) {
        console.log(x);
    }
}

test();