/**
 * Canvas Utility Functions
 */

class CanvasUtils {
    /**
     * Create rounded rectangle path
     * Polyfill for older browsers
     */
    static initRoundRectPolyfill() {
        if (!CanvasRenderingContext2D.prototype.roundRect) {
            CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
                this.beginPath();
                this.moveTo(x + radius, y);
                this.lineTo(x + width - radius, y);
                this.quadraticCurveTo(x + width, y, x + width, y + radius);
                this.lineTo(x + width, y + height - radius);
                this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                this.lineTo(x + radius, y + height);
                this.quadraticCurveTo(x, y + height, x, y + height - radius);
                this.lineTo(x, y + radius);
                this.quadraticCurveTo(x, y, x + radius, y);
                this.closePath();
            };
        }
    }

    /**
     * Draw text with word wrapping
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {string} text - Text to draw
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} maxWidth - Maximum width
     * @param {number} lineHeight - Line height multiplier
     * @param {number} textWidthRatio - Text width ratio
     */
    static drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, textWidthRatio) {
        const words = text.split(' ');
        const fontSize = parseInt(ctx.font.match(/\d+/)?.[0] || 16);
        
        if (words.length > 3 && maxWidth < 600) {
            const lines = [];
            let currentLine = '';
            
            words.forEach(word => {
                const testLine = currentLine + (currentLine ? ' ' : '') + word;
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth * textWidthRatio && currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            });
            
            if (currentLine) lines.push(currentLine);
            
            const actualLineHeight = fontSize * lineHeight;
            const totalHeight = lines.length * actualLineHeight;
            const startY = y - totalHeight / 2 + actualLineHeight / 2;
            
            lines.forEach((line, index) => {
                ctx.fillText(line, x, startY + index * actualLineHeight);
            });
        } else {
            ctx.fillText(text, x, y);
        }
    }

    /**
     * Download canvas as image
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @param {string} filename - Filename
     * @param {string} format - Image format
     */
    static downloadCanvas(canvas, filename, format = 'image/png') {
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, format);
    }
}

export default CanvasUtils;

