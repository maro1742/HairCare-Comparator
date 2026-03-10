const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
    try {
        const result = await ai.models.embedContent({
            model: 'text-embedding-004',
            contents: 'Hello world'
        });
        console.log("text-embedding-004 OK:", result.embeddings[0].values.length);
    } catch(e) {
        console.error("text-embedding-004 failed:", e.message);
    }
}
test();
