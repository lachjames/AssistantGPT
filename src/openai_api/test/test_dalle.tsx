// @ts-ignore
import { generateImage } from "../dall_e";
import * as fs from "fs";

const test = async () => {
    const image: ArrayBuffer = await generateImage(
        "A happy Jack Russell Terrier barking up at a camera, trying to play."
    );

    // Save image to file
    fs.writeFile("test.png", Buffer.from(image), (err) => {
        if (err) {
            console.error(err);
        }
    });
}

test();

export { } 