# Issue tracker: GitHub

Issues and PRDs for this repo live as GitHub issues. Use the `gh` CLI for all operations.

## Relationship to feature docs

Feature design lives in `docs/features/` — GitHub Issues are the *execution trigger*, not the
design home. See [`CONTRIBUTING.md`](../../CONTRIBUTING.md) for the full workflow.

- **Feature Issues** — created by running `/to-prd` once a feature doc's design is settled. The
  PRD is published as a GitHub Issue with `ready-for-agent` applied automatically. It contains
  user stories, implementation decisions, testing decisions, and a link back to the feature doc.
  A feature may produce multiple Issues (one per PR slice), each referencing the same feature doc.

- **Bug / task Issues** — no feature doc or PRD needed. Include a full description, steps to
  reproduce (for bugs), and acceptance criteria directly in the Issue.

## Conventions

- **Create an issue**: `gh issue create --title "..." --body "..."`. Use a heredoc for multi-line bodies.
- **Read an issue**: `gh issue view <number> --comments`, filtering comments by `jq` and also fetching labels.
- **List issues**: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` with appropriate `--label` and `--state` filters.
- **Comment on an issue**: `gh issue comment <number> --body "..."`
- **Apply / remove labels**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Close**: `gh issue close <number> --comment "..."`

Infer the repo from `git remote -v` — `gh` does this automatically when run inside a clone.

## Label vocabulary

`needs-triage` · `needs-info` · `ready-for-agent` · `ready-for-human` · `wontfix`

## When a skill says "publish to the issue tracker"

Create a GitHub issue.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --comments`.

## Claiming a ticket before starting work (cloud/remote sessions)

Two agents can end up on the same `ready-for-agent` issue if they start around the same time. When this session's
environment is a Claude Code cloud/remote environment (`$CLAUDE_CODE_REMOTE=true`), claim the ticket before writing
any code:

1. **Check for an existing claim**: `gh issue view <number> --json assignees,comments`. If another assignee is
   already present, or a comment matching `🤖 Claude Code is starting work on this ticket` was left recently (within
   the last several hours), another agent is likely already on it — stop and flag this to the user rather than
   proceeding, instead of starting duplicate work.
2. **Self-assign**: `gh issue edit <number> --add-assignee @me`
3. **Leave a claim comment** so a concurrent agent sees the ticket is taken:
   ```
   gh issue comment <number> --body "🤖 Claude Code is starting work on this ticket (session <session-id>)."
   ```

Skip this on local/CLI sessions (no `$CLAUDE_CODE_REMOTE`) — a human is already driving there, so the collision this
guards against doesn't apply.
