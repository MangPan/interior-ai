# Project#3 Interior-AI 앱 PWA 변환 작업 지시서

## 목표

기존 `interior-ai` Next.js 앱을 PWA로 변환한다.

최종 목표는 다음과 같다.

1. `next-pwa`를 적용하여 Service Worker가 생성되도록 한다.
2. `manifest.json`과 앱 아이콘을 추가하여 설치 가능한 PWA 형태로 만든다.
3. Vercel에 배포한다.
4. 배포된 URL에서 앱과 `/sw.js`가 정상 동작하는지 확인한다.
5. Lighthouse report를 생성한다.
6. 데스크톱 및 모바일 화면을 캡처한다.
7. 모든 캡처 화면에는 반드시 아래 문구가 자연스럽게 보여야 한다.

```text
by 2025810083 강민준
```

이 문구는 title, h1, subtitle, header 영역 등 캡처 시 자연스럽게 보이는 위치에 배치한다.  
캡처할 때마다 해당 문구가 화면에 보이는지 반드시 확인한다.

---

## 공통 주의사항

- `.env` 파일은 절대 GitHub에 올리지 않는다.
- `node_modules/`, `.next/`, `.env`는 `.gitignore`에 반드시 포함한다.
- Vercel 배포 시 필요한 환경변수는 Vercel Dashboard의 Environment Variables에 등록한다.
- PWA 캡처와 Lighthouse 캡처 시에는 배포된 Vercel URL을 기준으로 확인한다.
- 로컬 개발 서버 화면이 아니라 실제 배포 URL 화면을 우선 캡처한다.
- 모바일 캡처도 가능하면 배포 URL 기준으로 확인한다.
- 캡처 화면에 `by 2025810083 강민준` 문구가 빠지면 과제 증빙이 약해지므로, 모든 주요 화면에 이 문구가 보이도록 UI에 반영한다.

---

# 1. next-pwa 설치

## 해야 할 일

프로젝트 루트에서 다음 명령어를 실행한다.

```bash
npm install next-pwa
```

## 확인

`package.json`의 dependencies에 `next-pwa`가 추가되었는지 확인한다.

---

# 2. next.config.mjs 설정

## 해야 할 일

`next.config.mjs` 파일을 수정하여 `next-pwa`를 적용한다.

기본 설정 예시는 다음과 같다.

```js
import withPWA from "next-pwa";

const nextConfig = {
  reactStrictMode: true,
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
```

## 확인

- `next.config.mjs`에서 `withPWA`를 import했는지 확인한다.
- `dest: "public"` 설정이 있는지 확인한다.
- `register: true`, `skipWaiting: true`가 있는지 확인한다.
- 개발 환경에서는 PWA가 비활성화되도록 `disable: process.env.NODE_ENV === "development"` 설정을 둔다.

---

# 3. manifest.json 생성

## 해야 할 일

`public/manifest.json` 파일을 생성한다.

예시:

```json
{
  "name": "Interior AI",
  "short_name": "InteriorAI",
  "description": "AI-powered interior design app",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 아이콘 준비

다음 파일을 준비한다.

```text
public/icons/icon-192.png
public/icons/icon-512.png
```

아이콘은 반드시 존재해야 한다.

## 확인

브라우저에서 다음 경로에 접근했을 때 JSON이 보여야 한다.

```text
http://localhost:3000/manifest.json
```

또는 배포 후:

```text
https://배포-url.vercel.app/manifest.json
```

---

# 4. layout.js에 manifest 연결

## 해야 할 일

App Router 기준으로 `app/layout.js` 또는 `app/layout.jsx`에 manifest 정보를 연결한다.

예시:

```js
export const metadata = {
  title: "Interior AI",
  description: "AI-powered interior design app",
  manifest: "/manifest.json",
};
```

## 중요 요구사항

캡처용 식별 문구가 화면에 보여야 하므로, 실제 렌더링되는 페이지나 Header 영역에 다음 문구를 표시한다.

```text
by 2025810083 강민준
```

이 문구는 metadata가 아니라 실제 UI에 보여야 한다.

---

# 5. Service Worker 캐싱 전략 설정

## 해야 할 일

`next.config.mjs`에 Firebase Storage 이미지 캐싱 전략을 추가한다.

예시:

```js
import withPWA from "next-pwa";

const nextConfig = {
  reactStrictMode: true,
};

export default withPWA({
  dest: "public",
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "ai-images",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60
        }
      }
    }
  ],
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
```

## 확인

- `runtimeCaching` 배열이 존재하는지 확인한다.
- Firebase Storage URL 패턴이 포함되어 있는지 확인한다.
- `CacheFirst` 전략을 사용했는지 확인한다.
- 캐시 이름은 `ai-images`로 설정한다.

---

# 6. package.json에 Webpack 전용 build 스크립트 고정

## 배경

Next.js 16에서는 Turbopack이 기본으로 사용될 수 있다.  
하지만 `next-pwa`는 내부적으로 Webpack 설정을 주입하므로 Turbopack과 충돌할 수 있다.

## 해야 할 일

`package.json`의 scripts를 확인하고, build 과정에서 Turbopack이 호출되지 않도록 한다.

예시:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build --webpack",
    "start": "next start",
    "lint": "next lint"
  }
}
```

만약 현재 Next.js 버전이나 프로젝트 설정에서 `--webpack` 옵션이 지원되지 않으면, Turbopack 관련 옵션을 제거하고 일반 Webpack 기반 `next build`가 실행되도록 조정한다.

## 확인

```bash
npm run build
```

실행 시 Turbopack 충돌 에러가 없어야 한다.

---

# 7. 완전 초기화 후 다시 빌드

## 해야 할 일

기존 빌드 산출물과 의존성을 제거한 뒤 다시 설치하고 빌드한다.

macOS/Linux/WSL:

```bash
rm -rf .next node_modules
npm install
npm run build
npm start
```

Windows PowerShell:

```powershell
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules
npm install
npm run build
npm start
```

## 확인

- `npm run build`가 성공해야 한다.
- `npm start` 후 앱이 정상 실행되어야 한다.
- 빌드 후 `public/sw.js` 또는 관련 Service Worker 파일이 생성되는지 확인한다.

---

# 8. .gitignore 파일 생성

## 해야 할 일

프로젝트 루트에 `.gitignore` 파일을 만들고 다음 내용을 포함한다.

```gitignore
node_modules/
.next/
.env
```

## 추가 권장 항목

필요하면 아래도 추가한다.

```gitignore
.vercel/
.DS_Store
npm-debug.log*
```

## 확인

`git status`를 실행했을 때 `.env`, `node_modules`, `.next`가 추적 대상에 올라오면 안 된다.

---

# 9. GitHub에 New Repository 생성

## 해야 할 일

GitHub에서 새 repository를 생성한다.

추천 repository 이름:

```text
interior-ai-pwa
```

## 확인

- repository가 생성되었는지 확인한다.
- private/public 여부는 과제 제출 방식에 맞게 선택한다.
- repository URL을 복사해 둔다.

---

# 10. GitHub에 Push

## 해야 할 일

프로젝트 루트에서 다음 명령어를 실행한다.

```bash
git init
git add .
git commit -m "Deploy interior-ai PWA"
git branch -M main
git remote add origin https://github.com/USERNAME/interior-ai-pwa.git
git push -u origin main
```

`USERNAME`은 본인 GitHub 계정명으로 변경한다.

## 확인

GitHub repository 페이지에서 코드가 정상 업로드되었는지 확인한다.

특히 다음 파일들이 올라가 있어야 한다.

```text
app/
public/
public/manifest.json
public/icons/icon-192.png
public/icons/icon-512.png
next.config.mjs
package.json
.gitignore
```

다음 파일들은 올라가면 안 된다.

```text
.env
node_modules/
.next/
```

---

# 11. Vercel 프로젝트 생성

## 해야 할 일

Vercel에 접속한 뒤 새 프로젝트를 생성한다.

진행 순서:

1. Vercel 접속
2. Add New
3. Project 선택
4. GitHub repository 선택
5. `interior-ai-pwa` repository Import

## 확인

Vercel이 GitHub repository를 정상 인식해야 한다.

---

# 12. Environment Variables 설정

## 해야 할 일

Vercel 프로젝트 설정에서 Environment Variables를 등록한다.

위치:

```text
Vercel Dashboard → Project → Settings → Environment Variables
```

또는 프로젝트 Import 과정에서 Environment Variables 영역에 등록한다.

## 등록해야 할 가능성이 있는 값

기존 `.env`에 있던 값을 기준으로 등록한다.

예시:

```text
NEXT_PUBLIC_DATABASE_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL
NEXT_PUBLIC_CLERK_SIGN_UP_URL
REPLICATE_API_TOKEN
NEXT_PUBLIC_PAYPAL_CLIENT_ID
```

실제 프로젝트의 `.env` 키 이름과 정확히 일치해야 한다.

## 주의

- `.env` 파일 자체를 GitHub에 올리지 않는다.
- Vercel에는 key-value 형태로 직접 등록한다.
- `NEXT_PUBLIC_`이 필요한 값과 서버 전용 secret 값을 구분한다.

---

# 13. 배포 실행

## 해야 할 일

Vercel에서 Import 후 Deploy를 실행한다.

정상 흐름:

```text
Installing dependencies
Running "npm run build"
Compiled successfully
Deployment completed
```

## 확인할 URL

배포 완료 후 다음 URL들을 확인한다.

```text
https://본인-vercel-url.vercel.app
https://본인-vercel-url.vercel.app/sw.js
https://본인-vercel-url.vercel.app/manifest.json
```

## 확인 기준

- 랜딩 페이지가 정상 표시되어야 한다.
- 로그인 화면이 정상 표시되어야 한다.
- 대시보드가 정상 표시되어야 한다.
- `/sw.js`에 접근했을 때 Service Worker 코드가 보여야 한다.
- `/manifest.json`에 접근했을 때 manifest JSON이 보여야 한다.
- 화면 어딘가에 `by 2025810083 강민준` 문구가 보여야 한다.

---

# 14. Lighthouse report 생성

## 해야 할 일

Chrome DevTools에서 Lighthouse report를 생성한다.

진행 순서:

1. 배포된 Vercel URL 접속
2. Chrome DevTools 열기
3. Lighthouse 탭 선택
4. Mode는 Navigation 기본값 사용
5. Analyze page load 클릭
6. 리포트 생성 완료 후 캡처

## 캡처 시점

아래 화면을 캡처한다.

```text
Lighthouse 점수 결과 화면
```

캡처에는 다음 정보가 보이면 좋다.

- 배포된 URL
- Performance 점수
- Accessibility 점수
- Best Practices 점수
- SEO 점수

## 중요 요구사항

Lighthouse report 캡처 화면에도 가능하면 `by 2025810083 강민준` 문구가 보이도록 한다.  
리포트 화면 특성상 본문 UI가 잘 안 보일 수 있으므로, 최소한 앱 화면 캡처들에는 반드시 해당 문구가 보여야 한다.

---

# 15. 화면 캡처 제출

## 해야 할 일

과제 제출용 화면 캡처를 준비한다.

모든 주요 캡처에는 반드시 아래 문구가 보여야 한다.

```text
by 2025810083 강민준
```

이 문구는 title, h1, subtitle, header, footer 중 자연스러운 위치에 배치한다.

예시:

```jsx
<p className="text-sm text-gray-500 mt-2">
  by 2025810083 강민준
</p>
```

또는 Header에 다음처럼 배치한다.

```jsx
<span className="text-xs text-gray-500">
  by 2025810083 강민준
</span>
```

## 캡처해야 할 화면 목록

### 15-1. 랜딩 페이지 캡처

URL:

```text
https://본인-vercel-url.vercel.app
```

포함되어야 할 내용:

- `AI Room and Home Interior AI`
- `Transform Your Space with AI`
- `Get started` 버튼
- 메인 이미지
- `by 2025810083 강민준`

### 15-2. 로그인 화면 캡처

포함되어야 할 내용:

- Clerk 로그인 화면
- 앱 이름 또는 페이지 제목
- 가능하면 `by 2025810083 강민준`

만약 Clerk 로그인 화면 구조상 문구 삽입이 어렵다면, 로그인 전 이동하는 랜딩 화면과 로그인 후 대시보드 화면에서 문구가 확실히 보이도록 한다.

### 15-3. 대시보드 화면 캡처

포함되어야 할 내용:

- `Interior AI`
- `Buy More Credits`
- `Credits left`
- `Generate AI Interior`
- 이미지 목록
- `by 2025810083 강민준`

### 15-4. 결과 모달 화면 캡처

포함되어야 할 내용:

- Result 모달
- 생성 전/후 이미지
- Close 버튼
- 가능하면 배경 또는 Header에 `by 2025810083 강민준`

### 15-5. 모바일 설치 가능 화면 캡처

모바일 브라우저에서 배포 URL에 접속한다.

포함되어야 할 내용:

- PWA 설치 안내 또는 설치 메뉴
- 앱 이름 `Interior AI`
- 가능하면 `by 2025810083 강민준`

### 15-6. 모바일 홈 화면 설치 결과 캡처

PWA를 설치한 뒤 모바일 홈 화면 또는 앱 목록에서 확인한다.

포함되어야 할 내용:

- 앱 아이콘
- 앱 이름 `InteriorAI` 또는 `Interior AI`

### 15-7. 모바일 랜딩 페이지 캡처

PWA 또는 모바일 브라우저에서 랜딩 페이지를 연다.

포함되어야 할 내용:

- 모바일 화면에 맞게 표시된 랜딩 페이지
- `Get started` 버튼
- `by 2025810083 강민준`

### 15-8. 모바일 대시보드 캡처

모바일에서 로그인 후 대시보드에 접속한다.

포함되어야 할 내용:

- 이미지 목록
- `Credits left`
- `Generate AI Interior`
- `by 2025810083 강민준`

---

# 캡처 전 최종 체크리스트

캡처하기 전에 아래 항목을 반드시 확인한다.

```text
[ ] 배포 URL이 정상 접속된다.
[ ] /sw.js가 정상 접속된다.
[ ] /manifest.json이 정상 접속된다.
[ ] Lighthouse report를 생성했다.
[ ] 랜딩 페이지에 by 2025810083 강민준 문구가 보인다.
[ ] 대시보드에 by 2025810083 강민준 문구가 보인다.
[ ] 모바일 화면에서도 by 2025810083 강민준 문구가 보인다.
[ ] .env 파일이 GitHub에 올라가지 않았다.
[ ] Vercel Environment Variables가 등록되어 있다.
[ ] PWA 아이콘이 정상 표시된다.
[ ] 모바일에서 설치 가능하거나 설치된 앱이 정상 실행된다.
```

---

# UI에 식별 문구 추가 권장 위치

가장 안전한 방법은 랜딩 페이지와 대시보드 Header 양쪽에 모두 문구를 넣는 것이다.

## app/page.js 예시

```jsx
<p className="text-sm text-gray-500 mt-2">
  by 2025810083 강민준
</p>
```

랜딩 페이지 제목 아래에 배치한다.

## app/dashboard/_components/Header.jsx 예시

```jsx
<span className="text-xs text-gray-500">
  by 2025810083 강민준
</span>
```

Header의 `Interior AI` 근처나 오른쪽 영역에 배치한다.

이렇게 하면 랜딩 페이지, 대시보드, 결과 모달 캡처 시 대부분의 화면에서 식별 문구가 자연스럽게 포함된다.

---

# 최종 제출물 기준

최종적으로 다음 자료를 제출할 수 있어야 한다.

```text
1. GitHub repository URL
2. Vercel 배포 URL
3. /sw.js 확인 URL
4. Lighthouse report 캡처
5. 랜딩 페이지 캡처
6. 대시보드 캡처
7. 결과 모달 캡처
8. 모바일 설치 또는 실행 화면 캡처
9. 모바일 랜딩/대시보드 화면 캡처
```

모든 앱 화면 캡처에는 `by 2025810083 강민준` 문구가 보이도록 한다.
