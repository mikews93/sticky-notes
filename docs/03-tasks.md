# Implementation Tasks — Sticky Notes SPA

Tasks are ordered by dependency. Each references the requirement(s) it satisfies.

---

## Phase 1: Foundation

- [x] 1.1 Scaffold Vite + React + TypeScript project
- [x] 1.2 Install dependencies (Tailwind, testing libs, json-server, clsx, tailwind-merge)
- [x] 1.3 Create directory structure
- [ ] 1.4 Configure Vite (path alias, Tailwind plugin)
- [ ] 1.5 Configure Vitest (jsdom, setup file, path alias)
- [ ] 1.6 Configure Playwright (webServer, testDir)
- [ ] 1.7 Create db.json for json-server
- [ ] 1.8 Configure Tailwind in index.css
- [ ] 1.9 Create CLAUDE.md with project rules

## Phase 2: Types & Utilities

- [ ] 2.1 Define TypeScript types — `src/types/index.ts`
  - _Requirements: All features depend on Note type_
- [ ] 2.2 Implement geometry utils — `src/utils/geometry.ts`
  - `rectsOverlap(a, b)` — AABB collision
  - `clampPosition(pos, noteSize, boardSize)` — bounds clamping
  - _Requirements: F3 (move clamping), F4 (trash detection)_
- [ ] 2.3 Implement ID generation — `src/utils/ids.ts`
  - _Requirements: F1 (create note)_
- [ ] 2.4 Implement cn() utility — `src/lib/utils.ts`
  - _Requirements: All components (conditional classes)_
- [ ] 2.5 Write unit tests for geometry utils
  - _Test: overlap, adjacent, disjoint, clamp edges_

## Phase 3: API Layer

- [ ] 3.1 Implement fetch wrapper — `src/api/client.ts`
  - _Requirements: B5 (REST API sync)_
- [ ] 3.2 Implement notes API — `src/api/notesApi.ts`
  - _Requirements: B5 (CRUD operations)_
- [ ] 3.3 Write unit tests for API client
  - _Test: endpoints, methods, delay, error handling_

## Phase 4: State Management

- [ ] 4.1 Implement notesReducer — `src/hooks/useNotes.ts`
  - _Requirements: F1, F2, F3, F4, B1, B2_
- [ ] 4.2 Implement useLocalStorage hook — `src/hooks/useLocalStorage.ts`
  - _Requirements: B3 (localStorage persistence)_
- [ ] 4.3 Implement useNotes hook (reducer + persistence)
  - _Requirements: B3, B5 (dual persistence)_
- [ ] 4.4 Write unit tests for notesReducer (all 7 actions)

## Phase 5: Custom Interaction Hooks

- [ ] 5.1 Implement useDrag — `src/hooks/useDrag.ts`
  - _Requirements: F3 (move by dragging)_
- [ ] 5.2 Implement useResize — `src/hooks/useResize.ts`
  - _Requirements: F2 (resize by dragging)_
- [ ] 5.3 Implement useTrashDetection — `src/hooks/useTrashDetection.ts`
  - _Requirements: F4 (trash zone overlap)_
- [ ] 5.4 Write unit tests for useDrag
- [ ] 5.5 Write unit tests for useResize
- [ ] 5.6 Write unit tests for useTrashDetection

## Phase 6: Components

- [ ] 6.1 Set up global styles — `src/index.css`
  - _CSS custom properties for note colors, reset, background_
- [ ] 6.2 Implement ResizeHandle — `src/components/ResizeHandle.tsx`
  - _Requirements: F2_
- [ ] 6.3 Implement TrashZone — `src/components/TrashZone.tsx`
  - _Requirements: F4_
- [ ] 6.4 Implement ColorPicker — `src/components/ColorPicker.tsx`
  - _Requirements: B4_
- [ ] 6.5 Implement Toolbar — `src/components/Toolbar.tsx`
  - _Requirements: F1, B4_
- [ ] 6.6 Implement Note — `src/components/Note.tsx`
  - _Requirements: F1, F2, F3, F4, B1, B2_
- [ ] 6.7 Implement Board — `src/components/Board.tsx`
  - _Requirements: All_
- [ ] 6.8 Implement App — `src/App.tsx`
  - _Requirements: All_
- [ ] 6.9 Write component unit tests (Note, Board, TrashZone)

## Phase 7: E2E Tests & Polish

- [ ] 7.1 Write E2E: notes CRUD — `tests/e2e/notes-crud.spec.ts`
  - _Validates: F1, B1, F4_
- [ ] 7.2 Write E2E: drag and drop — `tests/e2e/drag-and-drop.spec.ts`
  - _Validates: F2, F3, B2_
- [ ] 7.3 Write E2E: persistence — `tests/e2e/persistence.spec.ts`
  - _Validates: B3_
- [ ] 7.4 CSS polish (transitions, hover states, animations)
- [ ] 7.5 Cross-browser testing (Chrome, Firefox)
- [ ] 7.6 Minimum resolution check (1024x768)

## Phase 8: Quality Assurance

- [ ] 8.1 Run code review (adapted deusrex code-reviewer)
- [ ] 8.2 Run design review (adapted deusrex design-reviewer)
- [ ] 8.3 Run test review (adapted deusrex test-writer)
- [ ] 8.4 Write architecture description for submission
