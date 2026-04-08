# Stick 'Em Up - Sticky Notes SPA

> **Live Demo:** [https://mikews93.github.io/sticky-notes/](https://mikews93.github.io/sticky-notes/)

A single-page sticky notes application built with React 19, TypeScript, and Tailwind CSS v4. Features custom drag-and-drop interactions, real-time trash detection, dark mode, and dual-layer persistence -- all without any external UI or drag-and-drop libraries.

## Features

- **Create notes** in 5 colors (yellow, pink, blue, green, orange)
- **Drag and drop** notes anywhere on the canvas via custom hooks
- **Resize** notes from the bottom-right corner
- **Edit** note text inline with auto-expanding textarea
- **Delete** notes by dragging them to the trash zone (with collision detection)
- **Z-index management** -- click or drag a note to bring it to front
- **Dark mode** with glassmorphism neon styling
- **Persistence** -- localStorage for instant load + REST API sync
- **Dot grid canvas** background

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Styling | Tailwind CSS v4 (utility-first, no component libraries) |
| State | `useReducer` with pure reducer (exported for testing) |
| Persistence | localStorage (300ms debounce) + json-server REST API (1s debounce) |
| Build | Vite + Bun runtime |
| Unit Tests | Vitest + React Testing Library |
| E2E Tests | Playwright |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0+)
- Node.js 18+ (for Playwright)

### Install

```bash
bun install
```

### Development

```bash
# Start the Vite dev server (port 5174)
bun run dev

# Start the mock API server (port 3001) -- optional
bun run api
```

The app works fully offline with localStorage. The API server is optional and provides an additional sync layer.

### Build

```bash
bun run build
bun run preview
```

### Testing

```bash
# Unit tests (watch mode)
bun run test

# Unit tests (single run)
bun run test:run

# Unit tests with coverage
bun run test:coverage

# E2E tests (requires dev server running)
bun run test:e2e

# E2E tests with UI
bun run test:e2e:ui
```

## Architecture

```
types -> utils -> hooks -> components -> App
```

| Layer | Responsibility |
|---|---|
| **Types** (`src/types/`) | All TypeScript interfaces and discriminated unions |
| **Constants** (`src/constants.ts`) | Shared magic numbers (`MIN_NOTE_WIDTH`, etc.) |
| **Utils** (`src/utils/`) | Pure functions (geometry, ID generation) |
| **API** (`src/api/`) | Fetch wrapper + CRUD operations |
| **Hooks** (`src/hooks/`) | State management, drag/resize/trash logic |
| **Components** (`src/components/`) | UI rendering, compose hooks |
| **App** (`src/App.tsx`) | Root composition |

### Key Design Decisions

- **No drag-and-drop library** -- custom `useDrag` and `useResize` hooks with document-level mouse listeners for reliable cursor tracking
- **Local state during drag** -- position/size lives in component-local state during interactions to avoid re-rendering sibling notes on every mousemove
- **`React.memo`** on `Board` and `Note` to prevent cascade re-renders when drag state changes
- **AABB collision detection** between dragged note and trash zone for real-time deletion feedback
- **Dual persistence** -- localStorage for instant hydration, REST API for server sync with dirty-tracking (only changed notes are synced)
- **Spec-driven development** -- requirements, design, and task specs in `docs/` were written before implementation

### Data Flow

```
User mousedown -> useDrag sets local state + calls onDragStart
User mousemove -> useDrag updates local position -> useTrashDetection checks overlap
User mouseup   -> useDrag calls onDragEnd -> check isOverTrashRef -> delete or move
```

## Project Structure

```
sticky-notes/
  docs/                 # SDD specs (requirements, design, tasks, API, components)
  src/
    api/                # Fetch wrapper + CRUD operations
    components/         # Board, Note, Toolbar, TrashZone, ColorPicker, ResizeHandle
    hooks/              # useDrag, useResize, useTrashDetection, useNotes
    lib/                # cn() utility (clsx + tailwind-merge)
    types/              # TypeScript interfaces
    utils/              # Pure functions (geometry, IDs)
    constants.ts        # Shared constants
    App.tsx             # Root component
    index.css           # Global styles + CSS custom properties
    main.tsx            # Entry point
  tests/
    unit/               # Vitest unit tests
    e2e/                # Playwright E2E tests
  db.json               # Mock API data store
```

## License

MIT
