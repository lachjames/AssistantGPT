export enum GeneratedImageType {
    SCENE = "SCENE",
    CHARACTER = "CHARACTER",
    OBJECT = "OBJECT",
    ACTION = "ACTION",
}
export class GeneratedImage {
    type: GeneratedImageType;
    prompt: string;
    image: HTMLImageElement;

    constructor(type: GeneratedImageType, prompt: string, image: HTMLImageElement) {
        this.type = type;
        this.prompt = prompt;
        this.image = image;
    }
}

export class ImageManager {
    images: HTMLImageElement[];
    curImage: HTMLImageElement | null;

    constructor() {
        this.images = [];
        this.curImage = null;
    }
}