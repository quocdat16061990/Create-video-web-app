/**
 * Gemini Video API Service
 * Uses long-running predict for video generation (veo-3.1-generate-preview)
 */

import { videoHttpClient } from './videoHttpClient.js';

class GeminiVideoApiService {
    constructor(config = {}) {
        this.apiBaseUrl = config.apiBaseUrl || 'https://us-central1-aiplatform.googleapis.com/v1';
        this.model = config.model || 'veo-3.1-generate-preview';
        this.projectId = config.projectId || '';
        this.location = config.location || 'us-central1';
        this.pollIntervalMs = config.pollIntervalMs || 5000;
        this.maxPollAttempts = config.maxPollAttempts || 30;
    }

    /**
    * Generate video and return final download URI
    * @param {string} prompt
    * @returns {Promise<string>} video uri
    */
    async generateVideo(prompt) {
        if (!prompt || !prompt.trim()) throw new Error('Prompt is required');

        if (!this.projectId) {
            throw new Error('Missing projectId for video generation');
        }

        const startUrl = `/projects/${this.projectId}/locations/${this.location}/publishers/google/models/${this.model}:predictLongRunning`;

        const payload = {
            instances: [{
                prompt: prompt.trim()
            }],
            parameters: {
                aspectRatio: '16:9',
                sampleCount: 1,
                durationSeconds: '8',
                personGeneration: 'allow_all',
                addWatermark: true,
                includeRaiReason: true,
                generateAudio: true
            }
        };
        let startRes;
        try {
            startRes = await videoHttpClient.post(startUrl, payload);
        } catch (err) {
            const status = err?.response?.status;
            const body = err?.response?.data;
            console.error('[Veo start] URL:', startUrl);
            console.error('[Veo start] Payload:', JSON.stringify(payload));
            console.error('[Veo start] Status:', status);
            console.error('[Veo start] Body:', body);
            const apiMsg = body?.error?.message || JSON.stringify(body);
            throw new Error(apiMsg || `Start failed ${status || ''}`);
        }

        const startData = startRes.data;
        const operationName = startData.name;
        if (!operationName) {
            throw new Error('Operation name missing');
        }

        // Use fetchPredictOperation as recommended for predictLongRunning
        const pollUrl = `/projects/${this.projectId}/locations/${this.location}/publishers/google/models/${this.model}:fetchPredictOperation`;
        let attempts = 0;
        while (attempts < this.maxPollAttempts) {
            attempts += 1;
            let res;
            try {
                res = await videoHttpClient.post(pollUrl, { operationName });
            } catch (err) {
                const status = err?.response?.status;
                const body = err?.response?.data;
                console.error('[Veo poll] URL:', pollUrl);
                console.error('[Veo poll] Operation:', operationName);
                console.error('[Veo poll] Status:', status);
                console.error('[Veo poll] Body:', body);
                const apiMsg = body?.error?.message || JSON.stringify(body);
                throw new Error(apiMsg || `Poll failed ${status || ''}`);
            }
            const data = res.data;
            if (data.done) {
                const genResp = data?.response?.generateVideoResponse;
                const sampleVideo = genResp?.generatedSamples?.[0]?.video;
                const directVideo = data?.response?.videos?.[0];

                // Prefer URI if available
                const uri = sampleVideo?.uri || directVideo?.uri;
                if (uri) {
                    return { uri, mimeType: sampleVideo?.mimeType || directVideo?.mimeType || 'video/mp4' };
                }

                // Fallback to base64 bytes if provided
                const base64 = sampleVideo?.bytesBase64Encoded || directVideo?.bytesBase64Encoded;
                const mime = sampleVideo?.mimeType || directVideo?.mimeType || 'video/mp4';
                if (base64) {
                    const blob = this.base64ToBlob(base64, mime);
                    const url = URL.createObjectURL(blob);
                    return { uri: url, mimeType: mime, isBlobUrl: true };
                }

                console.error('[Veo poll] done=true but no uri/bytes. Full response:', JSON.stringify(data));
                throw new Error('No video uri returned');
            }
            await new Promise(r => setTimeout(r, this.pollIntervalMs));
        }
        throw new Error('Timeout waiting for video generation');
    }

    base64ToBlob(base64, mimeType = 'video/mp4') {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    }
}

export default GeminiVideoApiService;

