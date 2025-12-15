/**
 * Main Application Entry Point
 * Senior Frontend Architecture - Dependency Injection Pattern
 */

// Import all dependencies
import CONSTANTS from './config/constants.js';
import DomUtils from './utils/domUtils.js';
import GeminiApiService from './api/geminiApi.js';
import GeminiImageApiService from './api/geminiImageApi.js';
import GeminiVideoApiService from './api/geminiVideoApi.js';
import ImageGeneratorModule from './modules/imageGeneratorModule.js';
import VideoGeneratorModule from './modules/videoGeneratorModule.js';

/**
 * Initialize Gemini SDK
 * @returns {Object|null} SDK object or null
 */
function getGeminiSDK() {
    // Check for SDK in window.google
    if (window.google?.generativeai?.GoogleGenerativeAI) {
        return window.google.generativeai;
    }
    // Check for global GoogleGenerativeAI (from CDN) - safely check
    if (typeof window !== 'undefined' && typeof window.GoogleGenerativeAI !== 'undefined') {
        return { GoogleGenerativeAI: window.GoogleGenerativeAI };
    }
    // Return null if SDK not available - will use fetch API fallback
    return null;
}

/**
 * Initialize application
 */
function initApp() {
    // Initialize Gemini API Service with dependency injection
    const geminiApiService = new GeminiApiService({
        apiBaseUrl: CONSTANTS.GEMINI.apiBaseUrl,
        model: CONSTANTS.GEMINI.model,
        promptTemplate: CONSTANTS.GEMINI.promptTemplate,
        sdk: getGeminiSDK()
    });
    // Initialize Gemini Image API Service
    const geminiImageApiService = new GeminiImageApiService({
        apiBaseUrl: CONSTANTS.GEMINI_IMAGE.apiBaseUrl,
        model: CONSTANTS.GEMINI_IMAGE.model
    });
    // Initialize Gemini Video API Service
    const geminiVideoApiService = new GeminiVideoApiService({
        apiBaseUrl: CONSTANTS.GEMINI_VIDEO.apiBaseUrl,
        model: CONSTANTS.GEMINI_VIDEO.model,
        projectId: CONSTANTS.GEMINI_VIDEO.projectId,
        location: CONSTANTS.GEMINI_VIDEO.location,
        pollIntervalMs: CONSTANTS.GEMINI_VIDEO.pollIntervalMs,
        maxPollAttempts: CONSTANTS.GEMINI_VIDEO.maxPollAttempts
    });
    
    // Check if API key exists in .env
    if (!CONSTANTS.GEMINI.apiKey) {
        console.warn('⚠️ VITE_GEMINI_API_KEY not found in .env file');
    } else {
        console.log('✅ API key loaded from .env');
    }
    
    // Initialize utilities (static usage)
    const domUtils = DomUtils;
    
    // Initialize modules
    const imageGeneratorModule = new ImageGeneratorModule(
        CONSTANTS, domUtils, geminiImageApiService
    );
    const videoGeneratorModule = new VideoGeneratorModule(
        CONSTANTS, domUtils, geminiVideoApiService
    );
    
    // Expose functions for HTML onclick handlers
    window.generateImageWithGemini = function() {
        imageGeneratorModule.generateImage();
    };
    window.downloadGeneratedImage = function() {
        imageGeneratorModule.downloadGeneratedImage();
    };
    window.generateVideoWithGemini = function() {
        videoGeneratorModule.generateVideo();
    };
    
    console.log('✅ NanoBanana App initialized successfully!');
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM already loaded
    initApp();
}

