---
pubDate: 2026-03-29
title: Claude Code 사용 팁
slug: claude-code-tips
featured: false
draft: false
tags:
  - Claude
  - Claude Code
description: Claude Code를 더 효율적으로 사용하기 위한 터미널, 알림, 모바일 팁
category: 기술
---
## 터미널 설정

### cmux — 에이전트 친화적 터미널

Ghostty를 wrapping한 터미널이다. pane 분할이 편하고, 알림이 잘 되어서 에이전트 쓸 때 유용하다.

설정은 Ghostty 설정 파일(`~/.config/ghostty/config`)과 동일하게 사용한다.\n- [cmux 공식 사이트](https://cmux.com/)
- [GitHub](https://github.com/manaflow-ai/cmux)

<div style="border-bottom: 1px dashed var(--border);"></div>

## 모바일에서 Claude Code 사용

### Remote Control — 모바일 연결

터미널에서 아래 명령어를 실행하면 모바일에서도 Claude Code를 사용할 수 있다. QR코드가 뜨고 Claude 앱으로 스캔하면 연결된다.
```bash
claude remote-control
```

슬립 모드가 되면 연결이 끊기는 점은 주의.

- [공식 문서](https://code.claude.com/docs/en/remote-control)
