/**
 * Frugal mode extension.
 *
 * Injects the /frugal efficiency guidance (batch tool calls, minimize round
 * trips) into the system prompt every turn, on by default. Toggle with
 * /frugal; state persists across resumes.
 *
 * Publishes state changes over pi.events ("frugal:changed") for
 * my-powerline-footer to render the 🐜 ant flag next to the thinking indicator.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const GUIDANCE = `## Agent efficiency

Minimize LLM round trips.

When investigating:
- Batch independent tool calls, reads/searches/commands whenever possible.
- Prefer one shell command that gathers all relevant information over
  several sequential tool calls.
- Read related files together rather than one at a time.
- Perform broad repository discovery before reasoning about individual files.
- Avoid repeatedly inspecting the same files or state.
- After gathering sufficient evidence, make all related edits in one pass.
- Avoid progress narration and avoid asking for confirmation unless blocked.

When validating:
- Run the most relevant validation commands together when possible.
- Do not inspect successful command output unless needed.
- If validation fails, gather all useful failure information before reasoning
  about the fix.

Do not make a model round trip merely to decide the next obvious tool call.`;

interface FrugalState {
	enabled: boolean;
}

export default function frugalExtension(pi: ExtensionAPI): void {
	let enabled = true;

	function persistState(): void {
		pi.appendEntry("frugal-mode", { enabled } satisfies FrugalState);
	}

	function publish(): void {
		pi.events.emit("frugal:changed", { enabled });
	}

	pi.registerCommand("frugal", {
		description: "Toggle frugal mode (fewer LLM round trips)",
		handler: async (_args, ctx) => {
			enabled = !enabled;
			persistState();
			publish();
			ctx.ui.notify(enabled ? "Frugal mode enabled." : "Frugal mode disabled.", "info");
		},
	});

	pi.on("before_agent_start", async (event) => {
		if (!enabled) return;
		return { systemPrompt: `${event.systemPrompt}\n\n${GUIDANCE}` };
	});

	pi.on("session_start", async (_event, ctx) => {
		const entries = ctx.sessionManager.getEntries();
		const last = entries
			.filter((e: { type: string; customType?: string }) => e.type === "custom" && e.customType === "frugal-mode")
			.pop() as { data?: FrugalState } | undefined;

		if (last?.data) {
			enabled = last.data.enabled;
		}
		publish();
	});
}
