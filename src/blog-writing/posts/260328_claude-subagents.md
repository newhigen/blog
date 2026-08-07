---
pubDate: 2026-03-28
title: Subagent
slug: claude-subagents
featured: false
draft: false
tags:
  - Claude
  - Claude Code
description: Anthropic Subagents 강의 정리. 언제 쓰고, 어떻게 설계하고, 언제 피해야 하는지.
category: 기술
---
출처: [Introduction to Subagents](https://anthropic.skilljar.com/introduction-to-subagents)

# Tips

## Given

### Description
- use keyword **'proactively'**: delegate tasks without explicit asking

### System Prompts
- define **output format**: provides stopping points and prevents unnecessary long run
- add **report obstacles**: to prevent rediscover of solution at main thread

### When to Use
- if you don't need intermediate steps, then use subagents
	- running tests showed worse performance

## Thought

It is important to well specify description.
- Q. What is a 'well specified' description?
- Thus, it is important to have domain knowledge more than model's current limit.

# Content

## What are Subagents?

태스크를 위임하는 helper. 독립된 conversation context에서 실행되고 결과를 main thread로 요약해서 반환한다.

- intermediate steps이 격리됨 → main conversation을 어지럽히지 않음
- 반대로 intermediate steps의 visibility는 잃는다

**Benefits**

1. 작업을 **focused** 단위로 분리
2. main context window를 **clean** 하게 유지
3. 정보를 **concise** 요약으로 가져옴

### Types

**Built-in**
- General purpose
- Explore
- Plan

**Custom**
- 직접 system prompt와 tool access 정의
- e.g., code reviewer, test writer, documentation generator

## Creating a Subagent

`/agents` slash command로 Claude가 생성해준다.

- **Scope**: Project-level → `.claude/agents/`, User-level → `~/.claude/agents/`
- **Tool categories**: `All`, `Read-only`, `Edit`, `Execution`, `MCP`, `Other`
- **Model**: (fast → complex) `Haiku` → `Sonnet` → `Opus`, `Inherit`으로 main conversation과 같은 모델 사용
- **Color**: UI에서 어떤 subagent가 활성화됐는지 빠르게 파악 가능

### Config File

`.claude/agents/<YOUR_AGENT_NAME>.md`

```markdown
---
name: code-quality-reviewer
description: Use this agent when you need to review recently written or modified code for quality, security, and best practice compliance.
tools: Bash, Glob, Grep, Read, WebFetch, WebSearch
model: sonnet
color: purple
---

You are an expert code reviewer specializing in quality assurance...
```

**Properties**

- `name`: unique identifier. `@agent <YOUR_AGENT_NAME>`으로 직접 호출 가능
- `description`: subagent를 언제 사용할지. **반드시 single line**이어야 함
  - **`proactively`** 키워드를 넣으면 Claude가 명시적으로 요청하지 않아도 자동으로 위임
  - e.g., `Proactively suggest running this agent after major code changes...`
  - 구체적인 시나리오 예시를 추가하면 Claude가 언제 위임해야 할지 더 잘 판단함
- `tools`: subagent가 접근 가능한 tools
- `model`: 사용할 Claude 모델
- `color`: UI 색상

System prompt는 파일의 body(마크다운 본문)에 작성. 구체적으로 써야 한다.

## Designing Effective Subagents

**4가지 핵심**

### 1. Write Good Descriptions

description이 (1) 언제 실행할지와 (2) **무엇을 할지** 모두 결정한다.

예: diff를 가져와서 리뷰하도록 할 때, description에 "어떤 파일을 리뷰할지 명시하라"고 포함.

### 2. Define Output Format

**subagent에서 가장 중요한 single improvement.**

- 자연스러운 stopping point를 만들어줌
- 불필요하게 길게 실행되는 것을 방지
- 강의 기준 **43% faster**

```markdown
Provide your review in a structured format:

1. Summary: Brief overview of what you reviewed and overall assessment
2. Critical Issues: Security vulnerabilities, data integrity risks, or logic errors
3. Major Issues: Quality problems, architecture misalignment, or significant performance concerns
4. Minor Issues: Style inconsistencies, documentation gaps, or minor optimizations
5. Recommendations: Suggestions for improvement or best practices
6. Approval Status: Ready to merge/deploy or requires changes
7. Obstacles Encountered: Setup issues, workarounds, environment quirks, special flags needed
```

### 3. Report Obstacles

main thread가 같은 문제를 다시 발견하지 않도록, subagent가 만난 장애물을 반드시 보고하게 한다.

### 4. Limit Tool Access

- 의도치 않은 side effect 방지
- subagent의 역할을 명확하게 만듦

### Common Subagent Types and Tool Access

| Type                 | Read | Grep | Glob | Bash | Edit | Write |
| -------------------- | ---- | ---- | ---- | ---- | ---- | ----- |
| Research / read-only | ✓    | ✓    | ✓    |      |      |       |
| Code reviewer        | ✓    | ✓    | ✓    | ✓    |      |       |
| Code modification    | ✓    | ✓    | ✓    | ✓    | ✓    | ✓     |

## Using Subagents Effectively

> "whether the intermediate work matters to your main thread."

### When Subagents Shine

- exploration이 execution과 분리될 때 (dependency 없을 때)
- 결과만 필요할 때
- exploratory work가 main thread context를 어지럽힐 때
- fresh perspective나 custom system prompt가 필요할 때

**Use cases**
- **Research**: FUNC A가 어떻게 동작하는지 조사
- **Code Reviews**: 같은 thread에서 리뷰하면 오히려 작성 context 때문에 약한 피드백이 나올 수 있음
- **Custom System Prompts**: copywriting subagent, styling subagent 등

### When Subagents Hurt

> Only makes sense when the subagent does something the main thread can't.

**3가지 anti-pattern**

1. **Expert Claims/Personas**: "you are a X expert" 같은 형태
2. **Sequential/Multi-step Pipelines**: 단계 사이에서 정보가 손실됨
3. **Running Tests**: "tests failed" 결과만 받으면 추가 debug script를 만들어야 하는 상황이 생김
   - *"Testing has shown that test runner pattern performed worse among all configurations."*

### The Decision Rule

스스로에게 물어보자: **"intermediate work가 중요한가?"**

- No → subagent ✓
- Yes → subagent ✗
