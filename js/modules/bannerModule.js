/**
 * Banner Module
 * Handles banner creation, preview, and download
 */

class BannerModule {
    constructor(config, domUtils, canvasUtils) {
        this.config = config;
        this.dom = domUtils;
        this.canvas = canvasUtils;
        this.selectors = config.SELECTORS;
    }

    /**
     * Update banner preview
     */
    updatePreview() {
        const banner = this.dom.getElement(this.selectors.bannerPreview);
        const textPreview = this.dom.getElement(this.selectors.bannerTextPreview);
        
        if (!banner || !textPreview) return;
        
        // Get values
        const text = this.dom.getValue(this.selectors.bannerText) || 'SAMPLE TEXT';
        const width = this.dom.getValue(this.selectors.bannerWidth) + 'px';
        const height = this.dom.getValue(this.selectors.bannerHeight) + 'px';
        const bgColor = this.dom.getValue(this.selectors.bgColor);
        const textColor = this.dom.getValue(this.selectors.textColor);
        const fontSize = this.dom.getValue(this.selectors.fontSize) + 'px';
        const fontWeight = this.dom.getValue(this.selectors.fontWeight);
        const borderRadius = this.dom.getValue(this.selectors.borderRadius) + 'px';
        const shadow = this.dom.isChecked(this.selectors.shadow);
        const gradient = this.dom.isChecked(this.selectors.gradient);
        const gradientColor = this.dom.getValue(this.selectors.gradientColor);
        
        // Apply styles
        banner.style.width = width;
        banner.style.height = height;
        banner.style.borderRadius = borderRadius;
        banner.style.fontSize = fontSize;
        banner.style.fontWeight = fontWeight;
        
        // Background
        if (gradient) {
            banner.style.background = `linear-gradient(${this.config.STYLES.gradientDirection}, ${bgColor}, ${gradientColor})`;
        } else {
            banner.style.background = bgColor;
        }
        
        // Text
        textPreview.textContent = text;
        textPreview.style.color = textColor;
        
        // Shadow
        banner.style.boxShadow = shadow ? this.config.STYLES.shadow : this.config.STYLES.shadowNone;
        
        // Update info
        this.dom.setText(
            this.dom.getElement(this.selectors.sizeInfo),
            `${this.dom.getValue(this.selectors.bannerWidth)} x ${this.dom.getValue(this.selectors.bannerHeight)} px`
        );
        this.dom.setText(this.dom.getElement(this.selectors.bgInfo), bgColor);
        this.dom.setText(this.dom.getElement(this.selectors.textInfo), textColor);
    }

    /**
     * Download banner as image
     */
    downloadBanner() {
        const width = parseInt(this.dom.getValue(this.selectors.bannerWidth));
        const height = parseInt(this.dom.getValue(this.selectors.bannerHeight));
        
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Get styles
        const bgColor = this.dom.getValue(this.selectors.bgColor);
        const textColor = this.dom.getValue(this.selectors.textColor);
        const fontSize = parseInt(this.dom.getValue(this.selectors.fontSize));
        const fontWeight = this.dom.getValue(this.selectors.fontWeight);
        const borderRadius = parseInt(this.dom.getValue(this.selectors.borderRadius));
        const gradient = this.dom.isChecked(this.selectors.gradient);
        const gradientColor = this.dom.getValue(this.selectors.gradientColor);
        const text = this.dom.getValue(this.selectors.bannerText) || 'SAMPLE TEXT';
        
        // Draw background
        if (gradient) {
            const gradientBg = ctx.createLinearGradient(0, 0, width, height);
            gradientBg.addColorStop(0, bgColor);
            gradientBg.addColorStop(1, gradientColor);
            ctx.fillStyle = gradientBg;
        } else {
            ctx.fillStyle = bgColor;
        }
        
        // Draw rounded rectangle
        if (borderRadius > 0) {
            ctx.beginPath();
            ctx.roundRect(0, 0, width, height, borderRadius);
            ctx.fill();
        } else {
            ctx.fillRect(0, 0, width, height);
        }
        
        // Draw text
        ctx.fillStyle = textColor;
        ctx.font = `${fontWeight} ${fontSize}px ${this.config.CANVAS.fontFamily}`;
        ctx.textAlign = this.config.CANVAS.textAlign;
        ctx.textBaseline = this.config.CANVAS.textBaseline;
        ctx.fillText(text, width / 2, height / 2);
        
        // Download
        const filename = `${this.config.FILE_NAMES.bannerPrefix}${Date.now()}${this.config.FILE_NAMES.extension}`;
        this.canvas.downloadCanvas(canvas, filename, this.config.CANVAS.imageFormat);
    }

    /**
     * Reset banner to default values
     */
    resetBanner() {
        const def = this.config.DEFAULT_BANNER;
        this.dom.setValue(this.selectors.bannerText, def.text);
        this.dom.setValue(this.selectors.bannerWidth, def.width);
        this.dom.setValue(this.selectors.bannerHeight, def.height);
        this.dom.setValue(this.selectors.bgColor, def.bgColor);
        this.dom.setValue(this.selectors.bgColorText, def.bgColor);
        this.dom.setValue(this.selectors.textColor, def.textColor);
        this.dom.setValue(this.selectors.textColorText, def.textColor);
        this.dom.setValue(this.selectors.fontSize, def.fontSize);
        this.dom.setText(this.dom.getElement(this.selectors.fontSizeValue), `${def.fontSize}px`);
        this.dom.setValue(this.selectors.fontWeight, def.fontWeight);
        this.dom.setValue(this.selectors.borderRadius, def.borderRadius);
        this.dom.setText(this.dom.getElement(this.selectors.borderRadiusValue), `${def.borderRadius}px`);
        this.dom.setChecked(this.selectors.shadow, def.shadow);
        this.dom.setChecked(this.selectors.gradient, def.gradient);
        this.dom.setDisplay(this.dom.getElement(this.selectors.gradientGroup), this.config.STYLES.displayNone);
        this.dom.setValue(this.selectors.gradientColor, def.gradientColor);
        this.dom.setValue(this.selectors.gradientColorText, def.gradientColor);
        
        this.updatePreview();
    }

    /**
     * Apply template
     * @param {string} template - Template name
     */
    applyTemplate(template) {
        const t = this.config.TEMPLATES[template];
        if (!t) return;
        
        this.dom.setValue(this.selectors.bannerText, t.text);
        this.dom.setValue(this.selectors.bgColor, t.bgColor);
        this.dom.setValue(this.selectors.bgColorText, t.bgColor);
        this.dom.setValue(this.selectors.textColor, t.textColor);
        this.dom.setValue(this.selectors.textColorText, t.textColor);
        this.dom.setChecked(this.selectors.gradient, t.gradient);
        this.dom.setDisplay(
            this.dom.getElement(this.selectors.gradientGroup),
            t.gradient ? this.config.STYLES.displayBlock : this.config.STYLES.displayNone
        );
        if (t.gradientColor) {
            this.dom.setValue(this.selectors.gradientColor, t.gradientColor);
            this.dom.setValue(this.selectors.gradientColorText, t.gradientColor);
        }
        this.updatePreview();
    }
}

export default BannerModule;

