const { MsEdgeTTS, OUTPUT_FORMAT } = require("msedge-tts");

/**
 * Microsoft Edge TTS Service (Wrapper around msedge-tts)
 * Uses the library to handle authentication and WebSocket headers automatically.
 */

// Map our voice names to the library's expectation if needed, or pass directly.
// The library accepts standard names like "en-US-ChristopherNeural".

/**
 * Main function to synthesizing speech
 * @param {string} text - The text to speak
 * @param {object} options - Voice options { voiceName, rate, pitch }
 * @returns {Promise<Buffer>} - The audio buffer (MP3)
 */
async function generateSpeech(text, options = {}) {
    const { voiceName = "en-US-ChristopherNeural", pitch = "+0Hz", rate = "+0%" } = options;

    const tts = new MsEdgeTTS();

    // Set Voice and Format (High Quality 96kbps)
    await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);

    return new Promise((resolve, reject) => {
        const { audioStream } = tts.toStream(text, {
            pitch: pitch,
            rate: rate,
            volume: "+0%"
        });

        let audioData = [];

        audioStream.on('data', (chunk) => {
            audioData.push(chunk);
        });

        audioStream.on('end', () => {
            resolve(Buffer.concat(audioData));
        });

        audioStream.on('error', (err) => {
            console.error("MsEdgeTTS Stream Error:", err);
            reject(err);
        });
    });
}

// List of some popular high-quality voices
const VOICES = {
    "en-US-ChristopherNeural": "Christopher (Male, US, Conversational)",
    "en-US-AriaNeural": "Aria (Female, US)",
    "en-US-GuyNeural": "Guy (Male, US)",
    "en-US-JennyNeural": "Jenny (Female, US)",
    "en-GB-SoniaNeural": "Sonia (Female, UK)",
    "en-GB-RyanNeural": "Ryan (Male, UK)"
};

module.exports = {
    generateSpeech,
    VOICES
};
