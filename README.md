# 🧩 칠교 농장 (Tangram Farm)

초등학생을 위한 칠교(탱그램) 퍼즐 + 농장 성장 학습 웹앱

A tangram puzzle + farm growth learning web app for elementary school students.

---

## 소개 (Introduction)

**칠교 농장**은 전통 퍼즐 '칠교(탱그램)'를 통해 공간 지각력, 도형 인식, 창의적 사고력을 기르는 교육용 웹앱입니다.

- 7개의 칠교 조각으로 50가지 실루엣을 완성하세요
- 퍼즐을 클리어하면 농장 동물에게 먹이와 씨앗을 줄 수 있어요
- 광고 없음, 랜덤박스 없음, 결제 없음 — 순수 학습 목적

**Tangram Farm** is an educational web app that develops spatial awareness, shape recognition, and creative thinking through the traditional tangram puzzle.

- Complete 50 silhouettes with 7 tangram pieces
- Clear puzzles to earn rewards for your farm animals
- No ads, no loot boxes, no payments — pure educational fun

---

## 실행 방법 (Getting Started)

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
# → http://localhost:5173/tangram-farm/

# 빌드
npm run build

# 테스트
npm test
```

---

## GitHub Pages 배포

1. GitHub에 레포 생성 후 push
2. Settings → Pages → Source: **GitHub Actions** 선택
3. `main` 브랜치에 push 하면 자동 빌드 + 배포

```bash
git init
git add .
git commit -m "Initial commit: tangram farm"
git remote add origin https://github.com/<username>/tangram-farm.git
git push -u origin main
```

배포 URL: `https://<username>.github.io/tangram-farm/`

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | React 19 + TypeScript + Vite |
| 상태 관리 | Zustand |
| 렌더링 | SVG (터치/마우스 드래그 지원) |
| 테스트 | Vitest |
| 배포 | GitHub Actions → GitHub Pages |
| 저장 | localStorage (계정 없이 진행 저장) |

---

## 레벨 구성

| 레벨 | 난이도 | 대상 | 테마 |
|------|--------|------|------|
| 1-10 | ★☆☆☆☆ | 저학년 | 기초 도형 (4-5조각) |
| 11-20 | ★★☆☆☆ | 저학년 | 동물 (7조각 전부) |
| 21-30 | ★★★☆☆ | 고학년 | 다양한 주제 |
| 31-40 | ★★★★☆ | 고학년 | 복합·대칭 실루엣 |
| 41-50 | ★★★★★ | 전체 | 도전 레벨 |

---

## 프로젝트 구조

```
src/
  engines/puzzle/    # 퍼즐 판정 엔진 (Claude Code)
  engines/farm/      # 농장 엔진 (Codex CLI)
  components/puzzle/ # 퍼즐 UI 컴포넌트
  components/farm/   # 농장 UI 컴포넌트 (Codex CLI)
  stores/            # Zustand 상태 관리
  data/puzzles/      # 50레벨 퍼즐 데이터 JSON
  types/             # 타입 정의
  utils/             # storage 유틸리티
tests/               # Vitest 단위 테스트
```

---

## 기여 방법

[CONTRIBUTING.md](CONTRIBUTING.md) 참고

---

## 라이선스

MIT License — [LICENSE](LICENSE)

폰트: [Noto Sans KR](https://fonts.google.com/noto/specimen/Noto+Sans+KR) — SIL Open Font License

에셋 라이선스: [ASSET_LICENSES.md](ASSET_LICENSES.md)
