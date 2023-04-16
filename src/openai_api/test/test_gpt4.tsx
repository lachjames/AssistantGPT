import { iterableStreamGPT4Message } from '../gpt4';

const testIterable = async () => {
    for await (const token of iterableStreamGPT4Message([
        { role: 'user', content: 'Hi there!' }
    ])) {
        console.log("Token:", token)
    }
}

// test();
testIterable();
