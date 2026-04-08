# Technical Design — Sticky Notes SPA

## Architecture Overview

The application follows a **unidirectional data flow** pattern with React hooks as the state management layer. A pure reducer function handles all state transitions, making business logic testable in isolation from the UI.

```
User Interaction → Custom Hook (useDrag/useResize) → Local State (during drag)
                                                    → Reducer Dispatch (on end)
                                                    → Persistence (localStorage + API)
```

---

## Component Hierarchy

```
App
├── Toolbar
│   ├── ColorPicker (row of color swatches)
│   └── Add Note button
├── Board (position: relative, full viewport)
│   └── Note[] (position: absolute, one per note)
│       ├── Header (drag handle area)
│       ├── <textarea> (editable body)
│       └── ResizeHandle (bottom-right corner)
└── TrashZone (fixed bottom center)
```

### Data Flow

- **App** owns `useNotes()` hook — single source of truth
- **App** passes callback props down: `onMove`, `onResize`, `onDelete`, `onEditText`, `onBringToFront`, `onAddNote`
- **App** holds `trashRef` (React ref) forwarded to TrashZone and passed to Note for overlap detection
- **Note** manages its own position/size in local state during drag/resize (performance optimization)
- **Note** only dispatches to parent on drag/resize end

---

## State Management

### Reducer (`notesReducer`)

Pure function, exported separately for direct unit testing.

```typescript
type NotesAction =
  | { type: 'ADD_NOTE'; payload: { position, size, colour } }
  | { type: 'REMOVE_NOTE'; payload: { id } }
  | { type: 'MOVE_NOTE'; payload: { id, position } }
  | { type: 'RESIZE_NOTE'; payload: { id, size } }
  | { type: 'UPDATE_TEXT'; payload: { id, text } }
  | { type: 'BRING_TO_FRONT'; payload: { id } }
  | { type: 'SET_NOTES'; payload: Note[] }
```

### Persistence Strategy

1. **Mount**: Try `GET /notes` from API → success: `SET_NOTES` → failure: read localStorage
2. **On change**: Write to localStorage (debounced 300ms)
3. **On change**: Sync to API (debounced 1000ms, fire-and-forget)

---

## Custom Hooks

### `useDrag(options)`

Handles note movement via mousedown → mousemove → mouseup on document.

- **Key decision**: Listeners on `document`, not element — prevents losing drag on fast cursor movement
- **Key decision**: Uses `useRef` for mutable state — avoids stale closures in event handlers
- **Key decision**: `e.preventDefault()` on mousedown — blocks text selection during drag
- Returns: `{ handleMouseDown, isDragging, currentPosition }`

### `useResize(options)`

Handles note resizing via the bottom-right handle.

- Same document-level listener pattern as useDrag
- `stopPropagation` on mousedown — prevents triggering the note's drag handler
- Clamps to minimum size (120x80)
- Returns: `{ handleMouseDown, isResizing }`

### `useTrashDetection(options)`

Detects overlap between a dragged note and the trash zone using AABB collision.

- Takes: `trashRef`, `noteRect`, `isDragging`
- Uses `getBoundingClientRect()` on trash zone element
- Returns: `{ isOverTrash }`

---

## Performance Decisions

### Local State During Drag

During drag operations, position is stored in `useState` inside the `Note` component. The parent reducer is only dispatched on `dragEnd`. This prevents re-rendering all sibling notes on every mousemove.

```
During drag: Note local state updates → only dragged Note re-renders
On drag end: dispatch MOVE_NOTE → all notes get new state from reducer
```

### Why Not HTML5 Drag API

HTML5 drag events don't provide continuous position updates for free-form repositioning. They're designed for drop-target semantics. Custom mouse handlers give pixel-precise control.

---

## Error Handling

| Scenario | Strategy |
|---|---|
| localStorage corrupted | Start with empty board, log warning |
| API unavailable on mount | Fall back to localStorage silently |
| API write fails | Log error, data is safe in localStorage |
| Invalid note data from API | Validate shape, discard invalid entries |
| Note dragged outside board | Clamp position to board bounds |

---

## Testing Strategy

| Layer | Framework | What to Test |
|---|---|---|
| Reducer | Vitest | All 7 action types as pure function |
| Hooks | Vitest + renderHook | useDrag, useResize, useTrashDetection behavior |
| Utilities | Vitest | geometry overlap, clamping edge cases |
| API client | Vitest + mock fetch | Endpoints, delay, error handling |
| Components | Vitest + RTL | Rendering, user interactions, visual states |
| E2E | Playwright | Full user flows: create, drag, resize, trash, persist |
