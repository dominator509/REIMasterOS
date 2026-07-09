# TOOLS.md — Development Tool Ecosystem

This repository is optimized for four tools that work together cohesively.

## Tool Overview

```
┌─────────────────────────────────────────────────────┐
│                   REIMasterOS                        │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  Claude  │  │  Serena  │  │ Obsidian │          │
│  │   Code   │  │          │  │          │          │
│  │ Agentic  │  │  Symbolic│  │ Knowledge│          │
│  │ Coding   │  │  Editing │  │  Mgmt    │          │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘          │
│       │             │             │                  │
│       └─────────────┼─────────────┘                  │
│                     │                                │
│              ┌──────┴──────┐                        │
│              │     RTK      │                        │
│              │ Token Killer │                        │
│              └──────────────┘                        │
└─────────────────────────────────────────────────────┘
```

## 1. Claude Code (`.claude/`)

**Role**: Agentic coding harness — the primary tool for implementing features.

- `CLAUDE.md` — Project-specific instructions loaded at session start
- `settings.json` — Permissions, hooks, model config
- `commands/` — Custom slash commands (`/execplan`, `/verify`, `/docs`, `/rtk`)

### Key integrations:
- PreToolUse hook routes all Bash commands through RTK
- Serena MCP tools available for code intelligence
- Linear MCP integration for issue tracking

## 2. Serena (`.serena/`)

**Role**: Code intelligence and symbolic editing — understand and modify code efficiently.

- `project.yml` — Language servers, encoding, ignore patterns
- `memories/` — Durable project knowledge for future agents
- Uses LSP backends for TypeScript, Python, Rust, Go, Bash, and more

### Key integrations:
- MCP tools available directly in Claude Code (`mcp__serena__*`)
- Memories complement Claude Code's context window
- Symbolic editing (`replace_symbol_body`, `find_symbol`) reduces token usage vs full-file reads

### When to use Serena vs built-in tools:
| Task | Use |
|------|-----|
| Discover what's in a file | Serena `get_symbols_overview` |
| Read a specific function/class | Serena `find_symbol` with `include_body` |
| Find all references to a symbol | Serena `find_referencing_symbols` |
| Edit a whole function/class | Serena `replace_symbol_body` |
| Edit a few lines | Serena `replace_content` |
| Find files by name | Built-in Glob |
| Search for text patterns | Built-in Grep |

## 3. Obsidian (`.obsidian/`)

**Role**: Knowledge management — browse, search, and visualize project documentation.

- `app.json` — Editor and UI settings
- `appearance.json` — Theme and font settings
- `workspace.json` — Pinned files, sidebar layout, bookmarks
- `templates/` — Document templates (ExecPlans, specs, ADRs, daily notes)
- `graph.json` — Knowledge graph visualization

### Key integrations:
- Open the repo root as an Obsidian vault to get full wiki-style navigation
- `[[]]` wikilinks work between all project docs
- Graph view shows doc interconnections
- Templates for consistent document structure
- Daily notes for journaling progress (`journal/` folder)

### Recommended community plugins:
- **Dataview** — Query and list ExecPlans, specs by status
- **Kanban** — Visualize milestone progress
- **Calendar** — Navigate daily notes
- **Git** — Auto-commit vault changes

## 4. RTK — Rust Token Killer

**Role**: Token-optimized CLI proxy — reduces token consumption by 60-90% on dev operations.

- Already installed globally (`rtk 0.39.0`)
- All Bash commands auto-routed through `rtk hook claude` via PreToolUse hook
- Use `rtk gain` to see savings, `rtk discover` to find missed optimizations

### Configuration chain:
1. `~/.claude/settings.json` — Global PreToolUse hook (`rtk hook claude`)
2. `.claude/settings.json` — Project-level duplicate (defense in depth)
3. `~/.claude/RTK.md` — RTK command reference (loaded via `@RTK.md`)

## Cohesion Rules

### No conflicts:
- Serena and Claude Code both read from the same source tree — no locking issues
- Obsidian reads `.md` files only; it doesn't interfere with code
- RTK is transparent — commands work identically, just with fewer tokens

### Shared ignore patterns:
Each tool respects its own ignore config:
- Serena: `.gitignore` + `project.yml` `ignored_paths`
- Obsidian: Files starting with `.` are hidden by default
- Claude Code: Standard `.gitignore` respect

### Cross-tool references in docs:
- Claude Code: `CLAUDE.md` references AGENTS.md workflow
- Serena: `mem:task_completion` references COMMANDS.md verification
- Obsidian: Workspace bookmarks link to AGENTS.md, COMMANDS.md, ARCHITECTURE.md

## Quick Start

```bash
# Verify all tools are active
rtk --version          # RTK installed?
ls .claude/            # Claude Code configured?
ls .serena/            # Serena configured?
ls .obsidian/          # Obsidian configured?

# Start a coding session
# Claude Code auto-loads: CLAUDE.md → AGENTS.md workflow
# Bash commands auto-route through RTK
# Serena MCP tools available for code exploration

# Open docs in Obsidian
# File → Open Vault → C:\dev\REIMasterOS
```
