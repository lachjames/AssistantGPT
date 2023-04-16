export const getImageURL = async (prompt: string): Promise<string> => {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
        body: JSON.stringify({
            prompt: prompt,
            n: 1,
            size: "1024x1024"
        }),
        headers: {
            Authorization: "Bearer " + localStorage.getItem('openai-api-key'),
            "Content-Type": "application/json"
        },
        method: "POST",
    });

    console.log(response);

    const image_url: string = await response.json().then((data) => {
        console.log(data);
        return data["data"][0]["url"];
    });
    console.log("Image URL:", image_url);

    return image_url;
}

export const generateImage = async (prompt: string): Promise<ArrayBuffer> => {
    const imageUrl = await getImageURL(prompt);
    const response = await fetch(imageUrl);
    const imageData = await response.arrayBuffer();
    return imageData;
}