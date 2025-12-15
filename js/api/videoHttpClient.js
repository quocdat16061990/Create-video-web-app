import axios from 'axios';
import CONSTANTS from '../config/constants.js';

let accessToken = null;
let tokenExpiry = 0;
let refreshingPromise = null;

async function fetchNewToken() {
  const cfg = CONSTANTS.GEMINI_VIDEO;
  if (!cfg.clientId || !cfg.clientSecret || !cfg.refreshToken) {
    throw new Error('Thiếu CLIENT_ID / CLIENT_SECRET / REFRESH_TOKEN trong .env cho video');
  }

  const params = new URLSearchParams({
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret,
    refresh_token: cfg.refreshToken,
    grant_type: 'refresh_token',
  });

  const res = await axios.post('https://oauth2.googleapis.com/token', params);
  const data = res.data;
  accessToken = data.access_token;
  const now = Date.now();
  const expiresIn = (data.expires_in || 3600) - 60;
  tokenExpiry = now + expiresIn * 1000;
  return accessToken;
}

export async function getAccessToken() {
  const now = Date.now();
  if (accessToken && now < tokenExpiry) {
    return accessToken;
  }
  if (!refreshingPromise) {
    refreshingPromise = fetchNewToken().finally(() => {
      refreshingPromise = null;
    });
  }
  return refreshingPromise;
}

export const videoHttpClient = axios.create({
  baseURL: CONSTANTS.GEMINI_VIDEO.apiBaseUrl,
});

videoHttpClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  config.headers = config.headers || {};
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});


