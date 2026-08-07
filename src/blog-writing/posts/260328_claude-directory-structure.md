---
pubDate: 2026-03-28
title: .claude 디렉토리 구조
slug: claude-directory-structure
featured: false
draft: false
tags:
  - Claude
  - Claude Code
description: Claude Code 프로젝트의 .claude 폴더 전체 구조 정리.
category: 기술
---
출처: [@akshay_pachaar](https://x.com/akshay_pachaar/status/2035341800739877091)

```
your-project/
├── CLAUDE.md                  # 팀 공유 지침 (커밋)
├── CLAUDE.local.md            # 개인 오버라이드 (gitignore)
│
└── .claude/
    ├── settings.json          # 권한, 훅, 설정 (커밋)
    ├── settings.local.json    # 개인 권한 오버라이드 (gitignore)
    │
    ├── hooks/                 # settings.json에서 참조하는 훅 스크립트
    │   ├── bash-firewall.sh   # PreToolUse: 위험한 명령 차단
    │   ├── auto-format.sh     # PostToolUse: 편집 후 자동 포맷
    │   └── enforce-tests.sh   # Stop: 종료 전 테스트 통과 강제
    │
    ├── rules/                 # 모듈형 지침 파일
    │   ├── code-style.md
    │   ├── testing.md
    │   └── api-conventions.md
    │
    ├── skills/                # 자동 호출되는 워크플로
    │   ├── security-review/
    │   │   └── SKILL.md
    │   └── deploy/
    │       └── SKILL.md
    │
    └── agents/                # 특화된 서브에이전트 페르소나
        ├── code-reviewer.md
        └── security-auditor.md

~/.claude/
├── CLAUDE.md                  # 전역 개인 지침
├── settings.json              # 전역 설정 + 훅
├── skills/                    # 개인 스킬 (모든 프로젝트)
├── agents/                    # 개인 에이전트 (모든 프로젝트)
└── projects/                  # 세션 히스토리 + 자동 메모리
```
