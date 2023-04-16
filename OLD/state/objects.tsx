import { getImageURL } from '../../openai_api/dall_e';


export interface CharacterState {
    name: string;
    // description: string;
    backstory: string;
    goal: string;
    strength: string;
    weakness: string;
}


export class NPCState {
    name: string;
    backstory: string;
    goal: string;
    strength: string;
    weakness: string;
    disposition: string;
    voice: string;
    imageURL: string = "";
    imageURLPromise: Promise<string> | null = null;

    constructor(name: string, backstory: string, goal: string, strength: string, weakness: string, disposition: string, voice: string) {
        this.name = name;
        this.backstory = backstory;
        this.goal = goal;
        this.strength = strength;
        this.weakness = weakness;
        this.disposition = disposition;
        this.voice = voice;

        this.generateTokenArtwork();
    }

    async generateTokenArtwork() {
        const text = `Star Wars character token artwork for "${this.name}". Backstory: ${this.backstory}`;
        this.imageURLPromise = getImageURL(text).then((url) => {
            this.imageURL = url;
            return url;
        });
    }

    async getTokenURL(): Promise<string> {
        if (this.imageURL === "") {
            if (!this.imageURLPromise) {
                throw new Error("Image URL promise is null");
            }
            await this.imageURLPromise;
        }

        return this.imageURL;
    }
}
