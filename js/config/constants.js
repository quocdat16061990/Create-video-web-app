// NanoBanana Constants
// Tất cả các giá trị cố định được tập trung tại đây để dễ quản lý và bảo trì

const CONSTANTS = {
    // Default Banner Values
    DEFAULT_BANNER: {
        text: 'SALE 50% OFF',
        width: 300,
        height: 100,
        bgColor: '#FF6B6B',
        textColor: '#FFFFFF',
        fontSize: 24,
        fontWeight: '700',
        borderRadius: 8,
        shadow: true,
        gradient: false,
        gradientColor: '#4ECDC4'
    },

    // Banner Size Limits
    BANNER_SIZE: {
        minWidth: 100,
        maxWidth: 800,
        minHeight: 50,
        maxHeight: 400,
        minFontSize: 12,
        maxFontSize: 72,
        maxBorderRadius: 50
    },

    // Font Weight Options
    FONT_WEIGHTS: {
        thin: '300',
        normal: '400',
        semiBold: '600',
        bold: '700',
        black: '900'
    },

    // Template Configurations
    TEMPLATES: {
        sale: {
            text: 'SALE 50%',
            bgColor: '#FF6B6B',
            textColor: '#FFFFFF',
            gradient: true,
            gradientColor: '#FF8E8E'
        },
        new: {
            text: 'NEW',
            bgColor: '#4ECDC4',
            textColor: '#FFFFFF',
            gradient: true,
            gradientColor: '#44A08D'
        },
        hot: {
            text: 'HOT',
            bgColor: '#F093FB',
            textColor: '#FFFFFF',
            gradient: true,
            gradientColor: '#F5576C'
        },
        free: {
            text: 'FREE',
            bgColor: '#4FACFE',
            textColor: '#FFFFFF',
            gradient: true,
            gradientColor: '#00F2FE'
        },
        limited: {
            text: 'LIMITED',
            bgColor: '#FA709A',
            textColor: '#FFFFFF',
            gradient: true,
            gradientColor: '#FEE140'
        },
        premium: {
            text: 'PREMIUM',
            bgColor: '#30CFD0',
            textColor: '#FFFFFF',
            gradient: true,
            gradientColor: '#330867'
        }
    },

    // Color Mappings (Vietnamese & English)
    COLOR_MAP: {
        'đỏ': '#FF6B6B',
        'red': '#FF6B6B',
        'màu đỏ': '#FF6B6B',
        'xanh': '#4ECDC4',
        'blue': '#4ECDC4',
        'xanh dương': '#4FACFE',
        'màu xanh': '#4ECDC4',
        'xanh lá': '#38ef7d',
        'green': '#38ef7d',
        'xanh lục': '#38ef7d',
        'vàng': '#FEE140',
        'yellow': '#FEE140',
        'màu vàng': '#FEE140',
        'tím': '#764ba2',
        'purple': '#764ba2',
        'màu tím': '#764ba2',
        'hồng': '#F093FB',
        'pink': '#F093FB',
        'màu hồng': '#F093FB',
        'trắng': '#FFFFFF',
        'white': '#FFFFFF',
        'màu trắng': '#FFFFFF',
        'đen': '#000000',
        'black': '#000000',
        'màu đen': '#000000',
        'cam': '#FF8C42',
        'orange': '#FF8C42',
        'màu cam': '#FF8C42'
    },

    // Default Colors
    DEFAULT_COLORS: {
        bg: '#667eea',
        text: '#FFFFFF',
        gradient: null
    },

    // Gemini API Configuration
    GEMINI: {
        // Default text model for generateContent; image models will 404 on v1beta generateContent
        model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash',
        apiBaseUrl: import.meta.env.VITE_GEMINI_API_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta',
        apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
        apiKeyUrl: 'https://makersuite.google.com/app/apikey',
        promptTemplate: `Bạn là một chuyên gia thiết kế banner quảng cáo. Hãy mô tả chi tiết một banner dựa trên yêu cầu sau, bao gồm: màu sắc, bố cục, kiểu chữ, hiệu ứng. Mô tả ngắn gọn và rõ ràng:

Yêu cầu: {prompt}

Mô tả chi tiết banner:`
    },

    // Gemini Image Configuration (generateContent image models)
    GEMINI_IMAGE: {
        model: import.meta.env.VITE_GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image',
        apiBaseUrl: import.meta.env.VITE_GEMINI_API_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta',
        apiKey: import.meta.env.VITE_GEMINI_API_KEY || ''
    },

    // Gemini Video Configuration (long-running predict)
    GEMINI_VIDEO: {
        model: import.meta.env.VITE_GEMINI_VIDEO_MODEL || 'veo-3.1-generate-preview',
        // Dùng proxy dev: /vertex/v1 (vite dev server sẽ proxy sang aiplatform)
        apiBaseUrl: import.meta.env.VITE_GEMINI_VIDEO_API_BASE_URL || '/vertex/v1',
        projectId: import.meta.env.VITE_GEMINI_VIDEO_PROJECT_ID || 'n8npython-479410',
        location: import.meta.env.VITE_GEMINI_VIDEO_LOCATION || 'us-central1',
        clientId: import.meta.env.VITE_GEMINI_VIDEO_CLIENT_ID || '',
        clientSecret: import.meta.env.VITE_GEMINI_VIDEO_CLIENT_SECRET || '',
        refreshToken: import.meta.env.VITE_GEMINI_VIDEO_REFRESH_TOKEN || '',
        // Poll every 60s, up to 10 minutes
        pollIntervalMs: 60000,
        maxPollAttempts: 10
    },

    // Imagen API Configuration (Real Image Generation)
    IMAGEN: {
        model: 'imagen-4.0-generate-001',
        apiBaseUrl: import.meta.env.VITE_IMAGEN_API_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta',
        apiKey: import.meta.env.VITE_GEMINI_API_KEY || '', // Same API key as Gemini
        endpoint: 'predict',
        // Aspect ratios
        aspectRatios: {
            square: '1:1',
            portrait: '9:16',
            landscape: '16:9',
            wide: '4:3',
            tall: '3:4'
        },
        // Safety filter levels
        safetyLevels: {
            strict: 'block_most',
            moderate: 'block_some',
            lenient: 'block_few',
            none: 'block_none'
        },
        // Person generation
        personGeneration: {
            allowAll: 'allow_all',
            allowAdult: 'allow_adult',
            allowNone: 'allow_none'
        }
    },

    // Image Generation Settings
    IMAGE_GENERATION: {
        sizes: [512, 768, 1024],
        defaultWidth: 768,
        defaultHeight: 768,
        defaultBorderRadius: 20,
        colorAdjustAmount: -30,
        textShadow: {
            color: 'rgba(0, 0, 0, 0.5)',
            blur: 15,
            offsetX: 3,
            offsetY: 3
        },
        overlayGradient: {
            start: 'rgba(255,255,255,0.1)',
            end: 'rgba(0,0,0,0.2)'
        },
        lineHeightMultiplier: 1.2,
        textWidthRatio: 0.8,
        fontSizeDivisor: {
            short: 8,
            long: 10
        }
    },

    // Canvas & Text Rendering
    CANVAS: {
        fontFamily: "'Arial', 'Helvetica', sans-serif",
        textAlign: 'center',
        textBaseline: 'middle',
        imageFormat: 'image/png'
    },

    // Regex Patterns
    REGEX: {
        hexColor: /^#[0-9A-F]{6}$/i,
        hexColorInText: /#([0-9A-F]{6})/gi,
        textInQuotes: /(?:chữ|text|nội dung|nội dung banner)[\s:]+['"]([^'"]+)['"]/i,
        quotedText: /['"]([A-Z0-9%]+)['"]/i,
        bannerKeywords: /(?:SALE|NEW|HOT|FREE|LIMITED|PREMIUM)[\s0-9%]*/i
    },

    // File Naming
    FILE_NAMES: {
        bannerPrefix: 'nano-banner-',
        geminiPrefix: 'gemini-generated-',
        extension: '.png'
    },

    // Error Messages
    ERRORS: {
        noApiKey: 'Vui lòng nhập Gemini API Key',
        noPrompt: 'Vui lòng nhập mô tả ảnh bạn muốn tạo',
        noImage: 'Không có ảnh để tải xuống',
        apiCallFailed: 'Failed to call Gemini API',
        imageGenerationFailed: 'Lỗi khi tạo ảnh'
    },

    // UI Text
    UI: {
        loading: 'Đang tạo ảnh...',
        imageGenerated: 'Ảnh đã tạo:',
        downloadImage: '💾 Tải ảnh xuống',
        generateImage: '🎨 Tạo ảnh với Gemini'
    },

    // CSS Classes & IDs
    SELECTORS: {
        // Banner controls
        bannerText: 'bannerText',
        bannerWidth: 'bannerWidth',
        bannerHeight: 'bannerHeight',
        bgColor: 'bgColor',
        bgColorText: 'bgColorText',
        textColor: 'textColor',
        textColorText: 'textColorText',
        fontSize: 'fontSize',
        fontSizeValue: 'fontSizeValue',
        fontWeight: 'fontWeight',
        borderRadius: 'borderRadius',
        borderRadiusValue: 'borderRadiusValue',
        shadow: 'shadow',
        gradient: 'gradient',
        gradientGroup: 'gradientGroup',
        gradientColor: 'gradientColor',
        gradientColorText: 'gradientColorText',
        
        // Preview
        bannerPreview: 'bannerPreview',
        bannerTextPreview: 'bannerTextPreview',
        sizeInfo: 'sizeInfo',
        bgInfo: 'bgInfo',
        textInfo: 'textInfo',
        
        // Gemini AI
        geminiApiKey: 'geminiApiKey',
        imagePrompt: 'imagePrompt',
        imageWidth: 'imageWidth',
        imageHeight: 'imageHeight',
        generateBtn: 'generateBtn',
        loadingIndicator: 'loadingIndicator',
        imageResult: 'imageResult',
        generatedImage: 'generatedImage',
        videoResult: 'videoResult',
        videoStatus: 'videoStatus',
        videoDownload: 'videoDownload',
        videoSpinner: 'videoSpinner',
        errorMessage: 'errorMessage',
        errorText: 'errorText'
    },

    // Style Values
    STYLES: {
        shadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
        shadowNone: 'none',
        gradientDirection: '135deg',
        displayBlock: 'block',
        displayNone: 'none'
    },

    // Keywords for parsing
    KEYWORDS: {
        gradient: ['gradient', 'chuyển', 'màu chuyển'],
        shadow: ['bóng', 'shadow'],
        rounded: ['bo góc', 'rounded']
    }
};

// Export for use in other files (ES6 Module)
export default CONSTANTS;

// Also expose to window for backward compatibility
if (typeof window !== 'undefined') {
    window.CONSTANTS = CONSTANTS;
}

