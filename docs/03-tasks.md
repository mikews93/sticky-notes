# Implementation Tasks — Sticky Notes SPA

Tasks are ordered by dependency. Each references the requirement(s) it satisfies.

---

## Phase 1: Foundation

- [x] 1.1 Scaffold Vite + React + TypeScript project
- [x] 1.2 Install dependencies (Tailwind, testing libs, json-server, clsx, tailwind-merge)
- [x] 1.3 Create directory structure
- [x] 1.4 Configure Vite (path alias, Tailwind plugin, port 5174)
- [x] 1.5 Configure Vitest (jsdom, setup file, path alias)
- [x] 1.6 Configure Playwright (webServer, testDir, chromium)
- [x] 1.7 Create db.json for json-server
- [x] 1.8 Configure Tailwind in index.css (CSS custom properties for note colors)
- [x] 1.9 Create CLAUDE.md with project rules and .claude/ subagents

## Phase 2: Types & Utilities

- [x] 2.1 Define TypeScript types — `src/types/index.ts`
  - _Requirements: All features depend on Note type_
- [x] 2.2 Implement geometry utils — `src/utils/geometry.ts`
  - `rectsOverlap(a, b)` — AABB collision
  - `clampPosition(pos, noteSize, boardSize)` — bounds clamping
  - _Requirements: F3 (move clamping), F4 (trash detection)_
- [x] 2.3 Implement ID generation — `src/utils/ids.ts`
  - _Requirements: F1 (create note)_
- [x] 2.4 Implement cn() utility — `src/lib/utils.ts`
  - _Requirements: All components (conditional classes)_
- [x] 2.5 Extract shared constants — `src/constants.ts`
  - _MIN_NOTE_WIDTH, MIN_NOTE_HEIGHT, DEFAULT sizes, NOTE_COLOURS_
- [x] 2.6 Write unit tests for geometry utils (13 tests passing)
  - _Test: overlap, adjacent, disjoint, clamp edges_

## Phase 3: API Layer

- [x] 3.1 Implement fetch wrapper — `src/api/client.ts`
  - _Requirements: B5 (REST API sync), 300ms simulated delay_
- [x] 3.2 Implement notes API — `src/api/notesApi.ts`
  - _Requirements: B5 (CRUD operations)_
- [x] 3.3 Write unit tests for API client (6 tests passing)
  - _Test: endpoints, methods, delay, error handling_

## Phase 4: State Management

- [x] 4.1 Implement notesReducer — `src/hooks/useNotes.ts`
  - _Requirements: F1, F2, F3, F4, B1, B2_
- [x] 4.2 Implement useNotes hook (reducer + dual persistence)
  - _Requirements: B3 (localStorage debounced 300ms), B5 (API debounced 1s)_
  - _Note: useLocalStorage hook was removed — persistence handled directly in useNotes_
- [x] 4.3 Write unit tests for notesReducer (12 tests passing, all 7 actions)

## Phase 5: Custom Interaction Hooks

- [x] 5.1 Implement useDrag — `src/hooks/useDrag.ts`
  - _Requirements: F3 (move by dragging), document-level listeners, useRef for mutable state_
- [x] 5.2 Implement useResize — `src/hooks/useResize.ts`
  - _Requirements: F2 (resize by dragging), stopPropagation, min size clamping_
- [x] 5.3 Implement useTrashDetection — `src/hooks/useTrashDetection.ts`
  - _Requirements: F4 (trash zone overlap via AABB collision)_
- [ ] 5.4 Write unit tests for useDrag (deferred — covered by E2E)
- [ ] 5.5 Write unit tests for useResize (deferred — covered by E2E)
- [ ] 5.6 Write unit tests for useTrashDetection (deferred — covered by E2E)

## Phase 6: Components

- [x] 6.1 Set up global styles — `src/index.css`
  - _CSS custom properties for note colors, shadows, layout tokens, dot grid background_
- [x] 6.2 Implement ResizeHandle — `src/components/ResizeHandle.tsx`
  - _Requirements: F2_
- [x] 6.3 Implement TrashZone — `src/components/TrashZone.tsx`
  - _Requirements: F4 (forwardRef, idle/active states, trash icon)_
- [x] 6.4 Implement ColorPicker — `src/components/ColorPicker.tsx`
  - _Requirements: B4 (5 color swatches, radio group with ARIA)_
- [x] 6.5 Implement Toolbar — `src/components/Toolbar.tsx`
  - _Requirements: F1, B4 (title, color picker, add button)_
- [x] 6.6 Implement Note — `src/components/Note.tsx`
  - _Requirements: F1, F2, F3, F4, B1, B2 (composes useDrag, useResize, useTrashDetection)_
  - _Accessibility: role="article", aria-labels, ARIA on drag handle and textarea_
- [x] 6.7 Implement Board — `src/components/Board.tsx`
  - _Requirements: All (relative positioning, dot grid, maps notes)_
- [x] 6.8 Implement App — `src/App.tsx`
  - _Requirements: All (owns useNotes, selectedColour, trashRef, draggingNoteId)_
- [ ] 6.9 Write component unit tests (Note, Board, TrashZone) — deferred, covered by E2E

## Phase 7: E2E Tests & Polish

- [x] 7.1 Write E2E: notes CRUD — `tests/e2e/notes-crud.spec.ts` (5 tests)
  - _Validates: F1 (create), B1 (edit text), F4 (drag to trash), B4 (color selection)_
- [x] 7.2 Write E2E: drag and drop — `tests/e2e/drag-and-drop.spec.ts` (3 tests)
  - _Validates: F3 (move), F2 (resize), B2 (z-index on click)_
- [x] 7.3 Write E2E: persistence — `tests/e2e/persistence.spec.ts` (3 tests)
  - _Validates: B3 (localStorage restore, empty board, position persistence)_
- [x] 7.4 CSS polish (transitions on shadow/transform/opacity, hover states, dot grid)
- [ ] 7.5 Cross-browser testing (Chrome, Firefox) — manual verification pending
- [ ] 7.6 Minimum resolution check (1024x768) — manual verification pending

## Phase 8: Quality Assurance

- [x] 8.1 Run code review (code-reviewer subagent) — 10 findings, critical fixes applied
- [x] 8.2 Run design review (design-reviewer subagent) — 8 findings, key fixes applied
- [ ] 8.3 Run test review (test-writer subagent) — pending
- [x] 8.4 Write architecture description — `ARCHITECTURE.md`
- [x] 8.5 Set up .claude/ project config (CLAUDE.md, 4 subagents, /review command)

---

## Summary

- **31 unit tests** passing (geometry: 13, API: 6, reducer: 12)
- **11 E2E tests** passing (CRUD: 5, drag: 3, persistence: 3)
- **Build**: clean (TypeScript + Vite production build)
- **Remaining**: hook unit tests (5.4-5.6), component unit tests (6.9), cross-browser/resolution manual checks (7.5-7.6), test review (8.3)
