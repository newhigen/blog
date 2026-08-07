---
pubDate: 2026-03-25
title: SKILL.md
slug: claude-skill-md
featured: false
draft: false
tags:
  - Claude
  - Claude Code
description: SKILL.md로 Claude Code에 task-specific 전문성을 추가하는 방법과 CLAUDE.md와의 차이
category: 기술
---
SKILL.md는 Claude Code에 task-specific 전문성을 추가하는 방법이다. CLAUDE.md가 모든 대화에 로딩되는 반면, SKILL.md는 name과 description만 context window에 들어가고 필요할 때 on-demand로 로딩된다.

## CLAUDE.md vs. SKILL.md vs. Subagents vs. Hooks

|             | 설명                                                         |
| ----------- | ------------------------------------------------------------ |
| `CLAUDE.md` | 모든 대화에 로딩 — always-on 프로젝트 표준, 제약, 프레임워크 |
| `SKILL.md`  | 필요할 때 로딩 — task-specific 전문성                        |
| Subagents   | isolated execution context — 위임된 작업 실행                |
| Hooks       | event-driven                                                 |
| MCP servers | 외부 툴 및 인테그레이션                                      |

## 파일 구조

```
.claude/
  skills/
    <SKILL_NAME>/
      SKILL.md
      scripts/     (optional)
      references/  (optional)
      assets/      (optional)
```

`<SKILL_NAME>`은 descriptive하게 작성한다. scripts/는 실행 코드로 output만 토큰 소모. references/는 문서, assets/는 이미지·템플릿 등.

## SKILL.md 포맷

```markdown
---
name: <WHAT>
description: <WHEN> (max 1,024 characters)
allowed-tools: <TOOLS_USED_WITHOUT_PERMISSION> (optional)
model: <CLAUDE_MODEL> (optional)
---

<GUIDE> (max 500 lines recommended)
```

예시:

```markdown
---
name: codebase-onboarding
description: Helps new developers understand the system works.
allowed-tools: Read, Grep, Glob, Bash
model: sonnet
---
```

우선순위: Enterprise → Personal → Project → Plugins

## 적용 방법

1. `.claude/skills/<SKILL_NAME>/` 폴더 생성
2. SKILL.md 작성
3. 세션 재시작

## Skill Creator

`skills-ref` 툴로 스킬을 생성하고 평가할 수 있다. 스킬의 output은 두 가지다:
- **capability uplift**: 모델이 못하던 걸 할 수 있게 되는 것
- **encoded preference**: 원하는 방식대로 하도록 방향을 잡는 것

평가(eval)는 두 가지 목적이 있다:
- quality regression 감지
- 일반 모델 capability가 스킬을 추월했는지 확인

sample prompt를 input으로 넣으면 FP·FN을 줄이는 방향으로 description 수정을 제안해준다.

## Tips

- 500 lines 제한, 넘으면 분리
- 스킬이 트리거되지 않으면 description에 키워드 추가 (semantic matching 사용)
- allowed-tools로 자주 쓰는 툴을 permission 없이 허용 가능 — safety layer로 활용

## Troubleshooting

- 트리거 안 됨: description을 더 구체적으로
- 로딩 안 됨: 파일명·경로 확인. `claude --debug`로 로딩 여부 확인
- 잘못된 스킬 로딩: description을 다른 스킬과 더 명확하게 구분
- plugin 스킬 안 보임: 캐시 리로드
- runtime 에러: (A) description에 dependency 명시 (B) `chmod +x` (C) 경로는 항상 forward slash

## 공유

- 팀 레포 `.claude/skills/` — git으로 공유
- marketplace를 통한 plugin
- enterprise: `strictKnownMarketplaces`로 허용 마켓플레이스 제한
