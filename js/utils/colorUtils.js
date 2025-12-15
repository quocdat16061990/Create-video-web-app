/**
 * Color Utility Functions
 */

class ColorUtils {
    /**
     * Extract colors from description text
     * @param {string} description - Text description
     * @param {Object} colorMap - Color mapping object
     * @param {Object} defaultColors - Default color values
     * @param {RegExp} hexPattern - Regex pattern for hex colors
     * @returns {Object} Extracted colors {bg, text, gradient}
     */
    static extractColorsFromDescription(description, colorMap, defaultColors, hexPattern) {
        const colors = { bg: null, text: null, gradient: null };
        
        // Try to find hex colors
        const hexMatches = description.match(hexPattern);
        if (hexMatches && hexMatches.length > 0) {
            colors.bg = hexMatches[0];
            if (hexMatches.length > 1) {
                colors.gradient = hexMatches[1];
                colors.text = hexMatches[2] || defaultColors.text;
            } else {
                colors.text = defaultColors.text;
            }
        }
        
        // Try to find color names
        const lowerDesc = description.toLowerCase();
        const foundColors = [];
        
        for (const [key, value] of Object.entries(colorMap)) {
            if (lowerDesc.includes(key)) {
                foundColors.push(value);
            }
        }
        
        if (foundColors.length > 0 && !colors.bg) {
            colors.bg = foundColors[0];
            if (foundColors.length > 1) {
                colors.gradient = foundColors[1];
            }
            colors.text = foundColors.length > 2 ? foundColors[2] : defaultColors.text;
        }
        
        // Apply defaults
        colors.bg = colors.bg || defaultColors.bg;
        colors.text = colors.text || defaultColors.text;
        
        return colors;
    }

    /**
     * Adjust color brightness
     * @param {string} hex - Hex color code
     * @param {number} amount - Adjustment amount (-255 to 255)
     * @returns {string} Adjusted hex color
     */
    static adjustColor(hex, amount) {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.max(0, Math.min(255, (num >> 16) + amount));
        const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
        const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    /**
     * Validate hex color
     * @param {string} color - Color string
     * @param {RegExp} pattern - Validation pattern
     * @returns {boolean} Is valid
     */
    static isValidHexColor(color, pattern) {
        return pattern.test(color);
    }
}

export default ColorUtils;

