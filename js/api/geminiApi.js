/**
 * Gemini API Service
 * Handles all Gemini API interactions with dependency injection
 */

class GeminiApiService {
    constructor(config = {}) {
        this.apiBaseUrl = config.apiBaseUrl || 'https://generativelanguage.googleapis.com/v1beta';
        // Default text model for generateContent
        this.model = config.model || 'gemini-1.5-flash';
        this.promptTemplate = config.promptTemplate || '';
        this.sdk = config.sdk || null; // Dependency injection for SDK
    }

    /**
     * Enhance prompt using Gemini API
     * @param {string} apiKey - Gemini API key
     * @param {string} prompt - User prompt
     * @returns {Promise<string>} Enhanced prompt
     */
    async enhancePrompt(apiKey, prompt) {
        if (!apiKey || !prompt) {
            throw new Error('API key and prompt are required');
        }

        try {
            // Try using SDK first if available
            if (this.sdk && this.sdk.GoogleGenerativeAI) {
                return await this._enhanceWithSDK(apiKey, prompt);
            }
            
            // Fallback to fetch API
            return await this._enhanceWithFetch(apiKey, prompt);
        } catch (error) {
            console.error('Error enhancing prompt:', error);
            // Return original prompt if enhancement fails
            return prompt;
        }
    }

    /**
     * Enhance prompt using Google Generative AI SDK
     * @private
     */
    async _enhanceWithSDK(apiKey, prompt) {
        const GoogleGenerativeAI = this.sdk.GoogleGenerativeAI || this.sdk;
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: this.model });
        
        const enhancedPromptText = this.promptTemplate.replace('{prompt}', prompt);
        const result = await model.generateContent(enhancedPromptText);
        const response = await result.response;
        
        return response.text() || prompt;
    }

    /**
     * Enhance prompt using fetch API
     * @private
     */
    async _enhanceWithFetch(apiKey, prompt) {
        // Guard: image models are not supported on generateContent v1beta
        if (this.model.toLowerCase().includes('image')) {
            throw new Error('Model is image-only. Dùng model text, ví dụ: gemini-1.5-flash hoặc gemini-1.5-pro');
        }

        const url = `${this.apiBaseUrl}/models/${this.model}:generateContent?key=${apiKey}`;
        const enhancedPromptText = this.promptTemplate.replace('{prompt}', prompt);

        console.log('[Gemini] Calling generateContent', {
            url,
            model: this.model
        });
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: enhancedPromptText
                    }]
                }]
            })
        });
        
        if (!response.ok) {
            let message = `API call failed: ${response.status}`;
            if (response.status === 404) {
                message += ' (Model not found. Hãy thử model text: gemini-1.5-flash hoặc gemini-1.5-pro)';
            }
            const errBody = await response.text().catch(() => '');
            console.error('Gemini API error body:', errBody);
            throw new Error(message);
        }
        
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || prompt;
    }
}

// Export for use in modules
export default GeminiApiService;

