/**
 * Imagen API Service
 * Google's Imagen 4.0 for real image generation
 * This is different from Gemini - it actually generates images!
 */

class ImagenApiService {
    constructor(config = {}) {
        this.apiBaseUrl = config.apiBaseUrl || 'https://generativelanguage.googleapis.com/v1beta';
        this.model = config.model || 'imagen-4.0-generate-001';
        this.apiKey = config.apiKey || '';
    }

    /**
     * Generate image using Imagen API
     * @param {string} prompt - Image description prompt
     * @param {Object} options - Generation options
     * @param {number} options.sampleCount - Number of images to generate (1-4)
     * @param {string} options.aspectRatio - Image aspect ratio (1:1, 9:16, 16:9, 4:3, 3:4)
     * @param {string} options.safetyFilterLevel - Safety filter (block_some, block_few, block_most, block_none)
     * @param {string} options.personGeneration - Person generation setting (allow_all, allow_adult, allow_none)
     * @returns {Promise<Object>} Generated image data
     */
    async generateImage(prompt, options = {}) {
        if (!this.apiKey) {
            throw new Error('Imagen API key is required');
        }

        if (!prompt || !prompt.trim()) {
            throw new Error('Prompt is required');
        }

        const {
            sampleCount = 1,
            aspectRatio = '1:1',
            safetyFilterLevel = 'block_some',
            personGeneration = 'allow_all'
        } = options;

        const url = `${this.apiBaseUrl}/models/${this.model}:predict`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'x-goog-api-key': this.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    instances: [
                        {
                            prompt: prompt.trim()
                        }
                    ],
                    parameters: {
                        sampleCount: Math.min(Math.max(1, sampleCount), 4), // Limit 1-4
                        aspectRatio: aspectRatio,
                        safetyFilterLevel: safetyFilterLevel,
                        personGeneration: personGeneration
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.error?.message || 
                    `API request failed: ${response.status} ${response.statusText}`
                );
            }

            const data = await response.json();
            
            // Imagen API returns base64 encoded images
            if (data.predictions && data.predictions.length > 0) {
                return {
                    success: true,
                    images: data.predictions.map(prediction => ({
                        base64: prediction.bytesBase64Encoded,
                        mimeType: prediction.mimeType || 'image/png'
                    })),
                    metadata: {
                        model: this.model,
                        sampleCount: data.predictions.length
                    }
                };
            }

            throw new Error('No images generated from API response');
        } catch (error) {
            console.error('Imagen API Error:', error);
            throw error;
        }
    }

    /**
     * Convert base64 to blob URL
     * @param {string} base64 - Base64 encoded image
     * @param {string} mimeType - MIME type
     * @returns {string} Blob URL
     */
    static base64ToBlobUrl(base64, mimeType = 'image/png') {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        return URL.createObjectURL(blob);
    }

    /**
     * Convert base64 to blob
     * @param {string} base64 - Base64 encoded image
     * @param {string} mimeType - MIME type
     * @returns {Blob} Blob object
     */
    static base64ToBlob(base64, mimeType = 'image/png') {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    }
}

export default ImagenApiService;

