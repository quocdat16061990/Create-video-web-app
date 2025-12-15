/**
 * Text Parsing Utilities
 */

class TextParser {
    /**
     * Extract text from description
     * @param {string} description - Description text
     * @param {RegExp[]} patterns - Array of regex patterns to try
     * @param {string} defaultText - Default text if nothing found
     * @returns {string} Extracted text
     */
    static extractText(description, patterns, defaultText = 'BANNER') {
        for (const pattern of patterns) {
            const match = description.match(pattern);
            if (match) {
                return match[1] || match[0];
            }
        }
        return defaultText;
    }

    /**
     * Check if description contains keywords
     * @param {string} description - Description text
     * @param {string[]} keywords - Array of keywords
     * @returns {boolean} Contains keyword
     */
    static containsKeywords(description, keywords) {
        const lowerDesc = description.toLowerCase();
        return keywords.some(keyword => lowerDesc.includes(keyword));
    }
}

export default TextParser;

