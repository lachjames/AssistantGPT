// UltraRealisticVoicesAPI.ts
export enum Speaker {
    Larry = "larry",
    Jordan = "jordan",
    Susan = "susan",
    William = "william",
    Oliver = "oliver",
    Alfonso = "alfonso",
    Daniel = "daniel",
    Charlotte = "charlotte",
    Adrian = "adrian",
    Alexander = "alexander",
    Anthony = "anthony",
    Aurora = "aurora",
    Axel = "axel",
    Carter = "carter",
    Daisy = "daisy",
    Darcie = "darcie",
    Ellie = "ellie",
    Evelyn = "evelyn",
    Frankie = "frankie",
    Frederick = "frederick",
    Harrison = "harrison",
    Hudson = "hudson",
    Hunter = "hunter",
    Julian = "julian",
    Lillian = "lillian",
    Lottie = "lottie",
    Maverick = "maverick",
    Bret = "bret",
    Nolan = "nolan",
    Nova = "nova",
    Owen = "owen",
    Phoebe = "phoebe",
    Stella = "stella",
    Theodore = "theodore",
    Arthur = "arthur",
    Bruce = "bruce",
    Bryan = "bryan",
    Carlo = "carlo",
    Domenic = "domenic",
    Hayden = "hayden",
    Reynaldo = "reynaldo",
}

const API_BASE_URL = "https://play.ht/api/v1";
const SECRET_KEY = "175d7c0bd5e745f6b723af72483ba877";
const USER_ID = "snXK6cN42gPW7sbHiS0qthMJUR23";

async function fetchAudioURL(speaker: Speaker, text: string): Promise<string> {
    const requestBody = {
        voice: speaker,
        content: [text],
    };

    const response = await fetch(`${API_BASE_URL}/convert`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: SECRET_KEY,
            "X-User-ID": USER_ID,
        },
        body: JSON.stringify(requestBody),
    });

    // console.log(response.body);

    // response.body is a ReadableStream
    const reader = response?.body?.getReader();
    const result = await reader?.read();
    console.log("Result:", result);

    // Read Uint8Array to string
    const decoder = new TextDecoder("utf-8");
    const decodedString = decoder.decode(result?.value);
    console.log("Decoded string:", decodedString);

    const data = JSON.parse(decodedString);
    if (data.error) {
        throw new Error(data.error);
    }
    const transcriptionId = data.transcriptionId;

    let audioURL = "";
    while (audioURL === "") {
        const statusResponse = await fetch(
            `${API_BASE_URL}/articleStatus?transcriptionId=${transcriptionId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: SECRET_KEY,
                    "X-User-ID": USER_ID,
                },
            }
        );

        const statusData = await statusResponse.json();
        if (statusData.status === "SUCCESS") {
            audioURL = statusData.metadata.output[0];
        } else {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }

    // return audioURL;
    return "";
}

export async function speak(
    speaker: Speaker,
    text: string
): Promise<HTMLAudioElement> {
    const audioURL = await fetchAudioURL(speaker, text);
    const audio = new Audio(audioURL);
    return audio;
}

export async function speakRaw(
    speaker: Speaker,
    text: string
): Promise<string> {
    const audioURL = await fetchAudioURL(speaker, text);
    return audioURL;
}