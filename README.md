# 🎨 NanoBanana - AI Image & Video (Gemini / Veo)

Sinh ảnh (Gemini Image) và video (Veo 3.x) với Google Gemini. Đã gỡ phần tùy chỉnh banner cũ, chỉ giữ AI image/video.

## 📁 Cấu trúc thư mục

```
NanoBanana/
├── css/                    # Stylesheets (modular)
│   ├── base.css           # Reset & typography
│   ├── layout.css         # Layout styles
│   ├── components.css     # Component styles
│   └── main.css           # Main import file
├── js/
│   ├── api/               # API services
│   │   ├── geminiApi.js         # Text (enhance) — còn nhưng không dùng cho output
│   │   ├── geminiImageApi.js    # Gemini image generateContent (gemini-2.5-flash-image)
│   │   ├── geminiVideoApi.js    # Veo predictLongRunning + fetchPredictOperation
│   │   └── videoHttpClient.js   # Axios client + refresh token
│   ├── config/            # Configuration
│   │   └── constants.js   # Tất cả constants & wiring biến môi trường
│   ├── modules/           # Feature modules
│   │   ├── imageGeneratorModule.js   # Gọi Gemini image, hiển thị/tải ảnh
│   │   └── videoGeneratorModule.js   # Gọi Veo video, poll, hiển thị/tải video
│   └── app.js             # Entry point
├── index.html             # Main HTML
├── package.json           # NPM dependencies
├── vite.config.js         # Vite build config
└── README.md              # File này
```

## 🚀 Bắt đầu nhanh

### Yêu cầu
- Cài Node.js 16+ (https://nodejs.org) và npm.
- Có Google Cloud project + OAuth2 (client_id, client_secret, refresh_token) có quyền Vertex AI Video (Veo).

### Cài đặt
```bash
npm install
```

### Cấu hình `.env` (ví dụ)
```env
VITE_GEMINI_API_KEY=your_gemini_api_key

# Image
VITE_GEMINI_IMAGE_MODEL=gemini-2.5-flash-image
VITE_GEMINI_API_BASE_URL=https://generativelanguage.googleapis.com/v1beta

# Video (Veo)
VITE_GEMINI_VIDEO_CLIENT_ID=...apps.googleusercontent.com
VITE_GEMINI_VIDEO_CLIENT_SECRET=...
VITE_GEMINI_VIDEO_REFRESH_TOKEN=...
VITE_GEMINI_VIDEO_PROJECT_ID=n8npython-479410
VITE_GEMINI_VIDEO_LOCATION=us-central1
VITE_GEMINI_VIDEO_MODEL=veo-3.1-generate-preview
VITE_GEMINI_VIDEO_API_BASE_URL=https://us-central1-aiplatform.googleapis.com/v1
```

### Dev
```bash
npm run dev
# Mặc định http://localhost:3000
```

### Build
```bash
npm run build
# Kết quả trong dist/
```

### Preview build
```bash
npm run preview
```

## 🏗️ Kiến trúc & nguyên tắc
- Dependency Injection cho services/modules.
- Module/Service/Utility pattern, ES6 modules.
- Tách config tập trung (constants).
- Vite + code splitting, tree shaking, minify.

## 🎯 Tính năng
### AI Image
- Model: `gemini-2.5-flash-image` (generateContent)
- Input: prompt
- Output: ảnh (blob URL), xem trực tiếp + tải về

### AI Video
- Model: `veo-3.1-generate-preview` (predictLongRunning + fetchPredictOperation)
- Auth: OAuth2 (refresh token) qua Axios interceptor
- Poll: mặc định 60s, tối đa ~10 phút
- Output: URI nếu có; nếu chỉ có base64 sẽ convert blob và phát được

## 🔧 API
### Image (Gemini)
- Endpoint: `models/{model}:generateContent?key=API_KEY` (v1beta)

### Video (Veo)
- Start: `/projects/{project}/locations/{location}/publishers/google/models/{model}:predictLongRunning`
- Poll: `/projects/{project}/locations/{location}/publishers/google/models/{model}:fetchPredictOperation`
- Auth: Bearer token (tự refresh từ refresh_token)

## 📝 Scripts
- `npm run dev` — dev server
- `npm run build` — build production
- `npm run preview` — preview build

## 🛠️ Tech Stack
- Vite + Vanilla JS (ESM)
- Axios (video client + refresh token)
- Gemini Image (generateContent)
- Veo Video (predictLongRunning + fetchPredictOperation)

## 📝 License
MIT License
