import { Speaker, speak } from "./playht";
import * as fs from 'fs';

const test = async () => {
    const result = await speak(
        Speaker.Arthur,
        "Hello there! This is a test of the automated Swagger API generation!",

    )
    console.log(result);
}
test();