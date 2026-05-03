# 큐브왕국 보물찾기

어린이날 부스용 3D 큐브 퍼즐 게임입니다.

## 🚀 배포 가이드

현재 운영 배포는 **GitHub push → Cloudflare Pages 자동 배포** 흐름을 기준으로 합니다. `main` 브랜치에 push하면 Cloudflare가 `npm run build`를 실행하고 `dist` 폴더를 배포합니다.

### 사전 준비

- [ ] Cloudflare Pages 프로젝트 연결
- [ ] Build command: `npm run build`
- [ ] Build output directory: `dist`
- [ ] Node.js 버전은 Cloudflare Pages 기본 최신 LTS 사용
- [ ] 부스 운영 URL 확인
- [ ] 오디오/아이콘/manifest 정적 파일이 `public/`에 포함되어 있는지 확인

### 배포 명령어

```bash
npm run build
git add .
git commit -m "Prepare booth deployment"
git push
```

### Firebase Hosting 예비 설정

Firebase Hosting으로 전환할 경우를 대비해 `firebase.json`이 포함되어 있습니다.

- [ ] Firebase 프로젝트 생성 (console.firebase.google.com)
- [ ] Authentication → 익명 로그인 활성화
- [ ] Firestore Database 생성 (asia-northeast3)
- [ ] `.env` 파일 생성, `VITE_FIREBASE_*` 값 입력
- [ ] `npm run build`
- [ ] `firebase deploy`

### Firestore 인덱스

Firestore 리더보드로 전환할 경우:

- [ ] `scores`: `difficulty(ASC) + clearTime(ASC)` 복합 인덱스 생성

### 커스텀 도메인

- Cloudflare Pages → Custom domains에서 도메인 연결
- Firebase Hosting 사용 시 Firebase Hosting → 커스텀 도메인 연결

## 🎪 부스 운영 가이드

### 노트북 설정

1. Chrome 설치 후 사이트 접속
2. F11 풀스크린 또는 URL에 `?booth=true` 추가
3. Chrome 키오스크 모드:

```bash
chrome --kiosk --app=https://your-domain.pages.dev?booth=true
```

### 운영 팁

- 와이파이 안정성 확인
- 게임 자체는 오프라인 가능, 리더보드 동기화가 필요한 구성에서는 온라인 필요
- 노트북 절전모드 해제
- 음량 적절히 조절
- 행사 전 `npm run build`로 로컬 빌드 검증

### 관리자 대시보드

- URL: `/admin?key=큐브왕국2026`
- 오늘 플레이 수, 난이도 분포, 평균 클리어 시간, 큐브왕 배출 수 확인
- 최근 20개 리더보드 표시
- QR 코드로 사이트 공유
- 위험 구역에서 오늘 리더보드 리셋 가능

### 리더보드 리셋

`/admin?key=큐브왕국2026` 접속 → `오늘 리더보드 리셋` 버튼 → confirm 2회
