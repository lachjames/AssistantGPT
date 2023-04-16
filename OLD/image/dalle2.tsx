import { getImageURL } from "../../openai_api/dall_e";

export const getImage = async (prompt: string): Promise<HTMLImageElement> => {
    // Get the image data
    const imageURL = await getImageURL(
        "A happy Jack Russell Terrier barking up at a camera, trying to play."
    );

    // Create an image element
    const image = new Image();
    image.src = imageURL;

    return image;
}