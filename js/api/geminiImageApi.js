/**
 * Gemini Image API Service
 * Uses gemini-2.5-flash-image generateContent to create images
 */

class GeminiImageApiService {
    constructor(config = {}) {
        this.apiBaseUrl = config.apiBaseUrl || 'https://generativelanguage.googleapis.com/v1beta';
        this.model = config.model || 'gemini-2.5-flash-image';
    }

    /**
     * Generate image using Gemini image model
     * @param {string} apiKey - API key
     * @param {string} prompt - Image prompt
     * @returns {Promise<{blob: Blob, url: string, mimeType: string}>}
     */
    async generateImage(apiKey, prompt) {
        if (!apiKey) throw new Error('Missing API key');
        if (!prompt || !prompt.trim()) throw new Error('Prompt is required');

        const url = `${this.apiBaseUrl}/models/${this.model}:generateContent?key=${apiKey}`;

        const body = {
            contents: [{
                parts: [{ text: prompt.trim() }]
            }]
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            let message = `API call failed: ${response.status}`;
            if (response.status === 404) {
                message += ' (Model not found. Thử model: gemini-2.5-flash-image hoặc gemini-1.5-pro)';
            }
            const errBody = await response.text().catch(() => '');
            console.error('[Gemini Image] URL:', url);
            console.error('[Gemini Image] Body:', JSON.stringify(body));
            console.error('[Gemini Image] Error body:', errBody);
            throw new Error(message);
        }

        const data = await response.json();
        const part = data?.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        const inline = part?.inlineData;
        if (!inline?.data) {
            throw new Error('No image data returned from Gemini image model');
        }

        const mimeType = inline.mimeType || 'image/png';
        const blob = this.base64ToBlob(inline.data, mimeType);
        const urlObject = URL.createObjectURL(blob);

        return { blob, url: urlObject, mimeType };
    }

    base64ToBlob(base64, mimeType = 'image/png') {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    }
}

export default GeminiImageApiService;

