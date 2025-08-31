# Student Tracker Client

학생 성적 관리 시스템의 프론트엔드 애플리케이션입니다.

## 환경 변수 설정

### 개발 환경

```bash
# .env.local 파일 생성
VITE_API_BASE_URL=http://localhost:8080
```

### 프로덕션 환경 (Vercel)

Vercel 대시보드에서 환경 변수를 설정하세요:

- `VITE_API_BASE_URL`: AWS Elastic Beanstalk 백엔드 URL (기본값: `http://fit-math-prod-java.eba-3ezakhau.ap-northeast-2.elasticbeanstalk.com`)

**참고**: 환경 변수를 설정하지 않으면 기본값이 자동으로 사용됩니다.

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 배포

### Vercel 배포

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel --prod
```

### 환경 변수 설정 후 배포

1. Vercel 대시보드 → 프로젝트 → Settings → Environment Variables
2. `VITE_API_BASE_URL` 추가: AWS EB 백엔드 URL
3. 재배포

**중요**: 환경 변수를 설정하지 않아도 기본 AWS EB URL이 자동으로 사용됩니다.
