import { textToSpeech } from './voice';
import * as fs from 'fs';

const API_KEY = '994044dd3446c3ecd2a95c44ed5c89db';
const VOICE_ID = "pNInz6obpgDQGcFmaJgB";

const test = async () => {
    const result = await textToSpeech(
        VOICE_ID,
        API_KEY,
        {
            text: "Hello there! This is a test of the automated Swagger API generation!",
            voice_settings: {
                stability: 0.8,
                similarity_boost: 0.8
            }
        }
    )
    console.log(result);

    // result is an ArrayBuffer of uint8, which must be saved to a file
    // and played with an audio player (separately from this code)

    // Save the file
    fs.writeFileSync('test.mp3', Buffer.from(result));
}
test();