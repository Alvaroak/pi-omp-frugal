# @alvaroak/pi-omp-frugal

Agent-efficiency mode — fewer LLM round trips — one source file (`index.ts`) running on both **omp** ([@oh-my-pi/pi-coding-agent](https://github.com/oh-my-pi/pi)) and **pi** ([@earendil-works/pi-coding-agent](https://github.com/earendil-works/pi)).

The guidance is small and mechanical: batch independent tool calls, read related files together, do broad discovery before reasoning, make all related edits in one pass, don't make a model round trip merely to decide the next obvious call, and gather all failure information before reasoning about a fix.

State changes are published over `pi.events` (`frugal:changed`) so status footers can render an indicator.

## Usage

```bash
/frugal    # toggle (state persists across session resumes)
```

## Host differences (all in `index.ts`)

| | omp | pi |
|---|---|---|
| Detect | `"logger" in pi` | otherwise |
| `before_agent_start` | `systemPrompt: string[]` — append a section | `systemPrompt: string` — concatenate |

## Install

- omp: symlink this repository into `~/.omp/agent/extensions/pi-omp-frugal`.
- pi: add it as a git package in `~/.pi/agent/settings.json`, pinned to a release tag.

## License

MIT
