/**
 * Image Generator Module
 * Handles AI image generation using Gemini API
 */

class ImageGeneratorModule {
    constructor(config, domUtils, geminiImageApi) {
        this.config = config;
        this.dom = domUtils;
        this.geminiImageApi = geminiImageApi; // real image generation
        this.selectors = config.SELECTORS;
        this.generatedImageBlob = null;
    }

    /**
     * Generate image with Gemini AI
     */
    async generateImage() {
        // Get API key from .env only (no UI input)
        const apiKey = this.config.GEMINI_IMAGE.apiKey || this.config.GEMINI.apiKey || '';
        const prompt = this.dom.getValue(this.selectors.imagePrompt).trim();
        
        // Validate inputs
        if (!apiKey) {
            this.showError('API key không tìm thấy! Vui lòng thêm VITE_GEMINI_API_KEY vào file .env');
            return;
        }
        
        if (!prompt) {
            this.showError(this.config.ERRORS.noPrompt);
            return;
        }
        
        // Hide previous results
        this.dom.hide(this.dom.getElement(this.selectors.imageResult));
        this.dom.hide(this.dom.getElement(this.selectors.errorMessage));
        
        // Show loading
        this.dom.show(this.dom.getElement(this.selectors.loadingIndicator));
        const generateBtn = this.dom.getElement(this.selectors.generateBtn);
        if (generateBtn) generateBtn.disabled = true;
        
        try {
            // Directly generate image via Gemini image model
            if (!this.geminiImageApi) {
                throw new Error('Gemini image service not available');
            }
            const result = await this.geminiImageApi.generateImage(apiKey, prompt);

            this.generatedImageBlob = result.blob;
            const imgElement = this.dom.getElement(this.selectors.generatedImage);
            if (imgElement) {
                imgElement.src = result.url;
            }
            this.dom.show(this.dom.getElement(this.selectors.imageResult));
        } catch (error) {
            console.error('Error generating image:', error);
            this.showError(this.config.ERRORS.imageGenerationFailed + ': ' + error.message);
        } finally {
            this.dom.hide(this.dom.getElement(this.selectors.loadingIndicator));
            if (generateBtn) generateBtn.disabled = false;
        }
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        this.dom.setText(this.dom.getElement(this.selectors.errorText), message);
        this.dom.show(this.dom.getElement(this.selectors.errorMessage));
    }

    /**
     * Download generated image
     */
    downloadGeneratedImage() {
        if (!this.generatedImageBlob) {
            this.showError(this.config.ERRORS.noImage);
            return;
        }
        
        const url = URL.createObjectURL(this.generatedImageBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.config.FILE_NAMES.geminiPrefix}${Date.now()}${this.config.FILE_NAMES.extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

export default ImageGeneratorModule;

