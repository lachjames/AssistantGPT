// Import wheel from lib.js
const MODEL = "gpt-4";
// const MODEL = "gpt-3.5-turbo";

/*
curl https://api.openai.com/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "input": "Your text string goes here",
    "model": "text-embedding-ada-002"
  }'

*/

export const getEmbedding = async (text: string, model: string = "text-embedding-ada-002"): Promise<number[]> => {
  // Get the image data
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    body: JSON.stringify({
      input: text,
      model: model
    }),
    headers: {
      Authorization: "Bearer " + localStorage.getItem('openai-api-key'),
      "Content-Type": "application/json"
    },
    method: "POST",
  });

  const json = await response.json();
  const embedding = json.data[0].embedding;
  return embedding;
}