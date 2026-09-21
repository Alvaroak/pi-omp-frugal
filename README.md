# @alvaroak/pi-frugal

Agent-efficiency mode for the [Pi coding agent](https://github.com/earendil-works/pi): injects round-trip-minimizing guidance into the system prompt every turn, on by default.

The guidance is small and mechanical: batch independent tool calls, read related files together, do broad discovery before reasoning, make all related edits in one pass, don't make a model round trip merely to decide the next obvious call, and gather all failure information before reasoning about a fix.

## Usage

```bash
/frugal    # toggle (state persists across session resumes)
```

State changes are published over `pi.events` (`frugal:changed`) so status footers can render an indicator.

## Install

```bash
pi install git:github.com/Alvaroak/pi-frugal@v0.1.0
```

## License

MIT
