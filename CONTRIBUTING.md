# 기여 방법 (Contributing Guide)

## 개발 환경 설정

```bash
git clone https://github.com/<username>/tangram-farm.git
cd tangram-farm
npm install
npm run dev
```

## 코드 구조

- `Claude Code 담당`: 퍼즐 엔진, 퍼즐 UI 컴포넌트, 레벨 데이터
- `Codex CLI 담당`: 농장 엔진, 농장 UI 컴포넌트

## PR 규칙

1. `main` 브랜치에 직접 push 금지
2. feature 브랜치 → PR → 리뷰 후 merge
3. 테스트 통과 필수 (`npm test`)
4. 커밋 메시지: `feat:`, `fix:`, `refactor:`, `test:`, `docs:` 접두어 사용

## 콘텐츠 추가 (레벨 데이터)

`src/data/puzzles/level_001_050.json` 형식을 참고하여 레벨 데이터를 추가하세요.

## 금지 사항

- 랜덤박스, 뽑기, 광고, 결제 관련 코드
- 아동 비하, 수치심 유발 메시지
- Canvas 사용 (SVG 기반 유지)
- 외부 라이브러리 무단 추가 (라이선스 확인 필수)
