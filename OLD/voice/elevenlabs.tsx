import { textToSpeech } from './voice';

export enum Speaker {
    Adam = "pNInz6obpgDQGcFmaJgB",
    Antoni = "ErXwobaYiN019PkySvjV",
    Arnold = "VR6AewLTigWG4xSOukaG",
    Bella = "EXAVITQu4vr4xnSDxMaL",
    Domi = "AZnzlk1XvdvUeBnXmlld",
    Elli = "MF3mGyEYCl7XYWbV9V6O",
    Josh = "TxGEqnHWrfWFTfGW9XjX",
    Rachel = "21m00Tcm4TlvDq8ikWAM", // Too quiet, unfortunately
    Sam = "yoZ06aMxZJJ28mfd3POQ"
}

export const SpeakerToName: { [key: string]: Speaker } = {
    "Adam": Speaker.Adam,
    "Antoni": Speaker.Antoni,
    "Arnold": Speaker.Arnold,
    "Bella": Speaker.Bella,
    "Domi": Speaker.Domi,
    "Elli": Speaker.Elli,
    "Josh": Speaker.Josh,
    "Rachel": Speaker.Rachel,
    "Sam": Speaker.Sam
}


const queue: any[] = [];
let isProcessing = false;

const processQueue = async () => {
    if (queue.length === 0) {
        isProcessing = false;
        return;
    }

    isProcessing = true;
    const { speaker, text, resolve } = queue.shift();

    const result: ArrayBuffer = await textToSpeech(
        speaker,
        "994044dd3446c3ecd2a95c44ed5c89db",
        {
            text: text,
            voice_settings: {
                stability: 0.8,
                similarity_boost: 0.8
            }
        }
    )

    // Create the audio object and return it
    const audio = new Audio();
    audio.src = URL.createObjectURL(new Blob([result], { type: 'audio/mpeg' }));
    resolve(audio);

    processQueue();
}

export const speak = (speaker: Speaker, text: string) => {
    return new Promise<HTMLAudioElement>((resolve) => {
        queue.push({ speaker, text, resolve });

        if (!isProcessing) {
            processQueue();
        }
    });
}