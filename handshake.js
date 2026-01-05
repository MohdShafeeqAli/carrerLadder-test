const { GoogleGenAI } = require("@google/genai");

// 1. YOUR API KEY
const API_KEY = "AIzaSyDJTQSKdhWA-7Pg-OcUxdOL-VwbiXI_CY0";
const ai = new GoogleGenAI({ apiKey: API_KEY });

async function handshake() {
    console.log("🚀 Initializing 2026 Handshake...");

    // We will try the two main models for 2026
    const models = ["gemini-2.5-flash", "gemini-3-flash-preview"];

    for (const modelName of models) {
        try {
            console.log(`📡 Trying ${modelName}...`);
            const response = await ai.models.generateContent({
                model: modelName,
                contents: "Say '2026 ONLINE'"
            });

            if (response.text) {
                console.log("====================================");
                console.log(`✅ SUCCESS: ${modelName} is LIVE`);
                console.log("Gemini says:", response.text);
                console.log("====================================");
                return; // Success! Exit the loop.
            }
        } catch (err) {
            console.log(`❌ ${modelName} failed: ${err.message}`);
        }
    }

    console.log("------------------------------------");
    console.log("🛑 Still failing? Check your Google AI Studio dashboard.");
    console.log("Your account might be restricted to 'gemini-2.5-pro' only.");
    console.log("------------------------------------");
}

handshake();