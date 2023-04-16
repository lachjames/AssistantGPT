import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { Configuration, OpenAIApi } from 'openai';

const MODEL = "gpt-4";
// const MODEL = "gpt-3.5-turbo";

const streamChatGPTInternal = async (messages: Message[], model: string): Promise<ReadableStream> => {
    const payload = {
        body: JSON.stringify({
            model: model,
            messages: messages,
            temperature: 0,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stream: true
        }),
        headers: {
            // Authorization: "Bearer " + OPENAI_API_KEY,
            // Get the API Key from local storage
            Authorization: "Bearer " + localStorage.getItem('openai-api-key'),
            "Content-Type": "application/json"
        },
        method: "POST",
    };
    console.log("Payload:", payload);

    const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        payload
    );
    console.log("Response:", response);

    if (!(response.body instanceof ReadableStream)) {
        throw new Error("Response body is not a ReadableStream");
    }

    return response.body as ReadableStream;
}

async function* handleSSEData(stream: ReadableStream) {
    const reader = stream.getReader();
    const textDecoder = new TextDecoder("utf-8");

    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }

        const decodedValue = textDecoder.decode(value);
        const lines = decodedValue.split('\n');
        for (const line of lines) {
            // If line is [DONE], then we're done
            if (line === "[DONE]") {
                return;
            }

            const match = line.match(/data: (.*)/);
            if (match && match[1]) {
                if (match[1] === "[DONE]") {
                    return;
                }

                const jsonData = JSON.parse(match[1]);
                // Process the jsonData as needed
                yield jsonData;
            }
        }
    }
}

export interface Message {
    role: string;
    content: string;
}

export async function* iterableStreamGPT4Message(messages: Message[], model: string = MODEL) {
    // Wait 100ms to ensure the prompt chat message is created first
    await new Promise(resolve => setTimeout(resolve, 100));

    let tokens: string[] = [];
    let whole: string = "";

    let response: ReadableStream = await streamChatGPTInternal(messages, model);

    // Read the stream
    for await (const data of handleSSEData(response)) {
        console.log(data);
        const token = data?.choices[0]?.delta?.content;
        if (!token) {
            continue;
        }
        tokens.push(token);
        whole += token;
        console.log(whole);
        yield {
            token, whole,
            done: false
        };
    }

    yield {
        token: "",
        whole: whole,
        done: true
    };
}

export const getGPTResponse = async (model: string, instructions: string, prompt: string) => {
    // Calls streamGPT4Message and returns the whole response
    const messages = [
        {
            role: "system",
            content: instructions
        },
        {
            role: "user",
            content: prompt
        }
    ];
    // console.log("Calling GPT-4:", messages);
    const stream = iterableStreamGPT4Message(messages, model);
    let whole = "";
    for await (const { token, whole: w, done } of stream) {
        whole = w;
        if (done) {
            break;
        }
    }
    return whole;
}