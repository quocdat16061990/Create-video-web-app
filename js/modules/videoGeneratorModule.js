/**
 * Video Generator Module
 * Handles video generation via Gemini video model (long-running predict)
 */

class VideoGeneratorModule {
    constructor(config, domUtils, videoApi) {
        this.config = config;
        this.dom = domUtils;
        this.videoApi = videoApi;
        this.selectors = config.SELECTORS;
        this.videoUri = null;
    }

    async generateVideo() {
        const prompt = this.dom.getValue(this.selectors.imagePrompt).trim();

        if (!prompt) {
            this.showError(this.config.ERRORS.noPrompt);
            return;
        }

        // UI states
        this.dom.hide(this.dom.getElement(this.selectors.videoResult));
        this.dom.hide(this.dom.getElement(this.selectors.errorMessage));
        const generateBtn = this.dom.getElement(this.selectors.generateBtn);
        if (generateBtn) generateBtn.disabled = true;
        this.dom.setText(this.dom.getElement(this.selectors.videoStatus), '⏳ Đang tạo video...');
        this.dom.show(this.dom.getElement(this.selectors.videoResult));
        this.dom.show(this.dom.getElement(this.selectors.videoSpinner));

        try {
            const result = await this.videoApi.generateVideo(prompt);
            const uri = result?.uri;
            this.videoUri = uri;

            // Hiển thị video player
            const videoEl = this.dom.getElement(this.selectors.generatedVideo);
            if (videoEl) {
                videoEl.src = uri || '';
                videoEl.style.display = uri ? 'block' : 'none';
            }

            // Link tải
            const link = this.dom.getElement(this.selectors.videoDownload);
            if (link) {
                link.href = uri || '#';
                link.textContent = uri ? 'Mở/Tải video' : 'Không có video';
            }

            this.dom.setText(this.dom.getElement(this.selectors.videoStatus), uri ? '✅ Video đã sẵn sàng' : '⚠️ Không tìm thấy video');
            this.dom.show(this.dom.getElement(this.selectors.videoResult));
        } catch (error) {
            console.error('Error generating video:', error);
            this.showError(error.message || (this.config.ERRORS.imageGenerationFailed + ': Unknown error'));
        } finally {
            this.dom.hide(this.dom.getElement(this.selectors.videoSpinner));
            if (generateBtn) generateBtn.disabled = false;
        }
    }

    showError(message) {
        this.dom.setText(this.dom.getElement(this.selectors.errorText), message);
        this.dom.show(this.dom.getElement(this.selectors.errorMessage));
    }
}

export default VideoGeneratorModule;

