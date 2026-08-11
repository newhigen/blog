# writing.sungd.uk

> 읽은 것들을, 생각을, 만들면서 알게 된 것을 글로 씁니다.

[astro-chiri](https://github.com/the3ash/astro-chiri) 테마를 고쳐 쓴 Astro 사이트.
GitHub Actions 가 빌드해 Pages 로 배포한다.

```sh
pnpm install
pnpm dev
pnpm new       # 새 글 틀 만들기
```

## 글

`src/blog-writing/posts/` 에 `YYMMDD_slug.md`. 프론트매터로 주소와 분류가 정해진다.

```yaml
pubDate: 2026-06-10
title: 더 기버 1
slug: the-go-giver-1   # 없으면 파일명이 주소가 된다
category: 책            # 책 · 생각 · 기술
tags: [독서]
```

| 카테고리 | 내용                             |
| -------- | -------------------------------- |
| 책       | 서평과 독서 노트                 |
| 생각     | 개인 에세이와 사유               |
| 기술     | 개발·도구 기록                   |
| (없음)   | 홈의 "글" 필터에 함께 묶인다     |

초고는 `src/blog-writing/draft/` 에 두거나 파일명 앞에 `_` 를 붙인다 — 빌드에서 빠진다.

## 알아둘 것

- **링크 카드는 꺼져 있다.** 서버 라우트가 필요한데 GitHub Pages 는 정적만 서빙한다
  (`src/config.ts` 의 `linkCard`).
- 테마 원본을 따라가려면 `pnpm update-theme`.
- 기술 글 12편은 2026-08-09 에 없어진 `tech.sungd.uk` 에서 옮겨온 것이다.

## Preview

|                        홈                         |                          포스트                          |
| :-----------------------------------------------: | :------------------------------------------------------: |
| <img src="docs/screenshots/home.png" width="500"> | <img src="docs/screenshots/post-detail.png" width="500"> |

독서·글쓰기 활동은 히트맵으로 본다. 셀에 마우스를 올리면 그달에 읽은 책이 뜬다.

<img src="docs/screenshots/heatmap.png" width="300">
