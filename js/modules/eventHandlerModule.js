/**
 * Event Handler Module
 * Handles all DOM event listeners
 */

class EventHandlerModule {
    constructor(config, domUtils, bannerModule) {
        this.config = config;
        this.dom = domUtils;
        this.banner = bannerModule;
        this.selectors = config.SELECTORS;
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        this.setupBannerListeners();
        this.setupColorListeners();
        this.setupFormListeners();
    }

    /**
     * Setup banner-related listeners
     */
    setupBannerListeners() {
        // Text input
        this.addListener(this.selectors.bannerText, 'input', () => this.banner.updatePreview());
        
        // Size inputs
        this.addListener(this.selectors.bannerWidth, 'input', () => this.banner.updatePreview());
        this.addListener(this.selectors.bannerHeight, 'input', () => this.banner.updatePreview());
        
        // Font size
        this.addListener(this.selectors.fontSize, 'input', (e) => {
            this.dom.setText(
                this.dom.getElement(this.selectors.fontSizeValue),
                e.target.value + 'px'
            );
            this.banner.updatePreview();
        });
        
        // Font weight
        this.addListener(this.selectors.fontWeight, 'change', () => this.banner.updatePreview());
        
        // Border radius
        this.addListener(this.selectors.borderRadius, 'input', (e) => {
            this.dom.setText(
                this.dom.getElement(this.selectors.borderRadiusValue),
                e.target.value + 'px'
            );
            this.banner.updatePreview();
        });
        
        // Shadow
        this.addListener(this.selectors.shadow, 'change', () => this.banner.updatePreview());
        
        // Gradient
        this.addListener(this.selectors.gradient, 'change', (e) => {
            this.dom.setDisplay(
                this.dom.getElement(this.selectors.gradientGroup),
                e.target.checked ? this.config.STYLES.displayBlock : this.config.STYLES.displayNone
            );
            this.banner.updatePreview();
        });
    }

    /**
     * Setup color-related listeners
     */
    setupColorListeners() {
        // Background color
        this.addListener(this.selectors.bgColor, 'input', (e) => {
            this.dom.setValue(this.selectors.bgColorText, e.target.value);
            this.banner.updatePreview();
        });
        
        this.addListener(this.selectors.bgColorText, 'input', (e) => {
            if (this.isValidHexColor(e.target.value)) {
                this.dom.setValue(this.selectors.bgColor, e.target.value);
                this.banner.updatePreview();
            }
        });
        
        // Text color
        this.addListener(this.selectors.textColor, 'input', (e) => {
            this.dom.setValue(this.selectors.textColorText, e.target.value);
            this.banner.updatePreview();
        });
        
        this.addListener(this.selectors.textColorText, 'input', (e) => {
            if (this.isValidHexColor(e.target.value)) {
                this.dom.setValue(this.selectors.textColor, e.target.value);
                this.banner.updatePreview();
            }
        });
        
        // Gradient color
        this.addListener(this.selectors.gradientColor, 'input', (e) => {
            this.dom.setValue(this.selectors.gradientColorText, e.target.value);
            this.banner.updatePreview();
        });
        
        this.addListener(this.selectors.gradientColorText, 'input', (e) => {
            if (this.isValidHexColor(e.target.value)) {
                this.dom.setValue(this.selectors.gradientColor, e.target.value);
                this.banner.updatePreview();
            }
        });
    }

    /**
     * Setup form-related listeners
     */
    setupFormListeners() {
        // Add any additional form listeners here
    }

    /**
     * Add event listener helper
     * @param {string} id - Element ID
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     */
    addListener(id, event, handler) {
        const element = this.dom.getElement(id);
        if (element) {
            element.addEventListener(event, handler);
        }
    }

    /**
     * Validate hex color
     * @param {string} color - Color string
     * @returns {boolean} Is valid
     */
    isValidHexColor(color) {
        return this.config.REGEX.hexColor.test(color);
    }
}

export default EventHandlerModule;

