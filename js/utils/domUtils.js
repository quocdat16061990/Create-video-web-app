/**
 * DOM Utility Functions
 */

class DomUtils {
    /**
     * Get element by ID
     * @param {string} id - Element ID
     * @returns {HTMLElement|null}
     */
    static getElement(id) {
        return document.getElementById(id);
    }

    /**
     * Get multiple elements by IDs
     * @param {string[]} ids - Array of element IDs
     * @returns {Object} Object with id as key and element as value
     */
    static getElements(ids) {
        const elements = {};
        ids.forEach(id => {
            elements[id] = this.getElement(id);
        });
        return elements;
    }

    /**
     * Set element display style
     * @param {HTMLElement} element - Element
     * @param {string} display - Display value ('block', 'none', etc.)
     */
    static setDisplay(element, display) {
        if (element) {
            element.style.display = display;
        }
    }

    /**
     * Show element
     * @param {HTMLElement} element - Element
     */
    static show(element) {
        this.setDisplay(element, 'block');
    }

    /**
     * Hide element
     * @param {HTMLElement} element - Element
     */
    static hide(element) {
        this.setDisplay(element, 'none');
    }

    /**
     * Set text content
     * @param {HTMLElement} element - Element
     * @param {string} text - Text content
     */
    static setText(element, text) {
        if (element) {
            element.textContent = text;
        }
    }

    /**
     * Get value from input element
     * @param {string} id - Element ID
     * @param {*} defaultValue - Default value
     * @returns {*}
     */
    static getValue(id, defaultValue = '') {
        const element = this.getElement(id);
        return element ? element.value : defaultValue;
    }

    /**
     * Set value to input element
     * @param {string} id - Element ID
     * @param {*} value - Value to set
     */
    static setValue(id, value) {
        const element = this.getElement(id);
        if (element) {
            element.value = value;
        }
    }

    /**
     * Check if checkbox is checked
     * @param {string} id - Element ID
     * @returns {boolean}
     */
    static isChecked(id) {
        const element = this.getElement(id);
        return element ? element.checked : false;
    }

    /**
     * Set checkbox checked state
     * @param {string} id - Element ID
     * @param {boolean} checked - Checked state
     */
    static setChecked(id, checked) {
        const element = this.getElement(id);
        if (element) {
            element.checked = checked;
        }
    }

    /**
     * Set element display style
     * @param {HTMLElement} element - Element
     * @param {string} display - Display value
     */
    static setDisplay(element, display) {
        if (element) {
            element.style.display = display;
        }
    }
}

export default DomUtils;

