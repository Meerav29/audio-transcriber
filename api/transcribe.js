// Disable body parsing to receive raw audio data
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get the API key from environment variables
        const apiKey = process.env.DEEPGRAM_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'API key not configured' });
        }

        // Read the raw body as a buffer
        const chunks = [];
        for await (const chunk of req) {
            chunks.push(chunk);
        }
        const audioBuffer = Buffer.concat(chunks);

        // Forward the request to Deepgram
        const response = await fetch('https://api.deepgram.com/v1/listen', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${apiKey}`,
                'Content-Type': req.headers['content-type'] || 'application/octet-stream',
            },
            body: audioBuffer
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return res.status(response.status).json({
                error: errorData.message || `API Error: ${response.status} ${response.statusText}`
            });
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error('Transcription error:', error);
        return res.status(500).json({ error: error.message });
    }
}
