# Sticky Notes — Claude Code Project Memory

This file is automatically loaded by Claude Code on every session. It defines how the AI should think and behave when working on this codebase.

---

## Engineering Mindset

Operate as a **senior frontend engineer**. Before writing any code:

1. Read the relevant spec in `docs/` — requirements, design, or component spec
2. Read all relevant files — follow the call chain through hooks and components
3. Check for existing patterns before creating new abstractions
4. State a clear plan before executing

> Never write speculative code. Every change must have a clear, reasoned purpose.

---

## Architecture

This is a **single-page React application** with custom drag-and-drop interactions.

```
types → utils → hooks → components → App
```

| Layer | Owns |
|---|---|
| Types (`src/types/`) | All TypeScript interfaces, discriminated unions |
| Constants (`src/constants.ts`) | Shared magic numbers (MIN_NOTE_WIDTH, etc.) |
| Utils (`src/utils/`) | Pure functions (geometry, IDs) |
| API (`src/api/`) | Fetch wrapper + CRUD operations |
| Hooks (`src/hooks/`) | State management, drag/resize/trash logic |
| Components (`src/components/`) | UI rendering, compose hooks |
| App (`src/App.tsx`) | Root composition, owns `useNotes()` hook |

**Rules:**
- Types and constants are the foundation — everything imports from them
- Hooks own all interaction logic — components only render and delegate
- `useNotes` is the single source of truth (useReducer + persistence)
- During drag/resize, position/size lives in local component state (performance)
- Parent reducer is only dispatched on drag/resize **end**
- Document-level mouse listeners for reliable cursor tracking
- No component libraries — all UI is custom-built with Tailwind CSS

---

## Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 (utility classes, no CSS modules, no component libs)
- **State**: `useReducer` with pure `notesReducer` (exported for testing)
- **Persistence**: localStorage (debounced 300ms) + json-server REST API (debounced 1s)
- **Build**: Vite + Bun runtime
- **Unit Tests**: Vitest + React Testing Library (`tests/unit/`)
- **E2E Tests**: Playwright (`tests/e2e/`)
- **Mock API**: json-server watching `db.json` on port 3001

### Commands
```bash
bun run dev          # Vite dev server (port 5174)
bun run api          # json-server mock API (port 3001)
bun run build        # TypeScript check + Vite production build
bun run test         # Vitest watch mode
bun run test:run     # Vitest single run
bun run test:e2e     # Playwright E2E tests
```

---

## Code Quality

- **DRY**: More than 2 repeated lines → extract to utils or constants
- **Single Responsibility**: One hook, one job. One component, one visual concern
- **Naming**: Self-documenting names. Avoid `data`, `result`, `temp`, `obj`
- **TypeScript**: No `any`. Explicit types. Discriminated unions for actions. Use `NoteColour` not `string` for color keys
- **Comments**: Explain *why*, never *what*. Use section comments in components: `/** State */`, `/** Hooks */`, `/** Handlers */`, `/** Rendering */`
- **Constants**: All magic numbers in `src/constants.ts`, not inline

---

## Component Patterns

### Note Component
The most complex component. Integrates three hooks:
- `useDrag` — move by dragging header
- `useResize` — resize by dragging handle
- `useTrashDetection` — detect overlap with trash zone

Local state during drag prevents sibling re-renders. `isOverTrashRef` is a ref kept in sync so `handleDragEnd` can read the latest value synchronously.

### Data Flow
```
User mousedown → useDrag sets local state + calls onDragStart
User mousemove → useDrag updates local position → useTrashDetection checks overlap
User mouseup → useDrag calls onDragEnd → check isOverTrashRef → delete or move
```

### Styling
- Use Tailwind utility classes directly on elements
- Use `cn()` from `src/lib/utils.ts` for conditional classes
- Note colors defined as CSS custom properties in `index.css`
- Transitions only on `shadow, transform, opacity, border-color` — NEVER on `left/top/width/height` (breaks drag performance)

---

## Testing

- **Reducer**: Test `notesReducer` as a pure function — all 7 action types
- **Hooks**: Test via `renderHook` from RTL
- **Components**: Test behavior, not implementation — use `screen.getByRole`, avoid `getByTestId`
- **E2E**: Use `page.mouse.move/down/up` with `{ steps: 10 }` for drag simulation
- **API**: Mock `fetch` with `vi.stubGlobal`, verify endpoints/methods

---

## Spec-Driven Development

Before implementing new features:
1. Update `docs/01-requirements.md` with acceptance criteria (EARS format)
2. Update `docs/02-design.md` with technical approach
3. Update `docs/03-tasks.md` with implementation tasks
4. Write tests first (TDD)
5. Implement
6. Run code review subagent

---

## When Uncertain

| Question | If No → |
|---|---|
| Does a pattern already exist? | Find and follow it |
| Will this be easy to change later? | Simplify the abstraction |
| Does this handle failure gracefully? | Add error handling |
| Is this the right layer? | Move it |
| Would a new dev understand this? | Rename or add a comment |

---

## Project Structure

```
sticky-notes/
├── docs/               # SDD specs (source of truth for requirements)
├── src/
│   ├── api/            # Fetch wrapper + CRUD
│   ├── components/     # All custom React components
│   ├── hooks/          # useDrag, useResize, useTrashDetection, useNotes
│   ├── lib/            # cn() utility
│   ├── types/          # All TypeScript interfaces
│   ├── utils/          # Pure functions (geometry, ids)
│   ├── constants.ts    # Shared constants
│   ├── App.tsx         # Root component
│   ├── index.css       # Global styles + CSS custom properties
│   └── main.tsx        # Entry point
├── tests/
│   ├── unit/           # Vitest unit tests
│   └── e2e/            # Playwright E2E tests
├── .claude/
│   ├── agents/         # Code review, design review, test writer subagents
│   └── commands/       # Slash commands
├── ARCHITECTURE.md     # Submission architecture description
└── db.json             # Mock API data store
```
