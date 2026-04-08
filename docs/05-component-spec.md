# Component API Specification — Sticky Notes

## Note

The core component. Integrates drag, resize, trash detection, and text editing.

### Props

```typescript
interface NoteProps {
  note: Note;
  trashRef: RefObject<HTMLElement>;
  onMove: (id: string, position: NotePosition) => void;
  onResize: (id: string, size: NoteSize) => void;
  onDelete: (id: string) => void;
  onEditText: (id: string, text: string) => void;
  onBringToFront: (id: string) => void;
}
```

### Visual States

| State | Trigger | Visual |
|---|---|---|
| Default | Idle | Subtle shadow, note color bg, rounded corners |
| Hover | Mouse over header | cursor: grab |
| Dragging | mousedown + mousemove on header | Elevated shadow, scale(1.02), cursor: grabbing |
| Over Trash | Dragging + overlaps trash zone | Red border, opacity 0.8 |
| Editing | Click on textarea | Focus ring on textarea, cursor: text |
| Resizing | mousedown on resize handle | Resize cursor (nwse-resize) |

### Internal Behavior

- Uses `useDrag` hook on header area
- Uses `useResize` hook on ResizeHandle child
- Uses `useTrashDetection` to check overlap during drag
- Maintains local `position` and `size` state during drag/resize
- Syncs local state from props via `useEffect` when not dragging/resizing
- Calls `onBringToFront` on any mousedown
- On drag end: if `isOverTrash` → `onDelete(id)`, else → `onMove(id, pos)`

---

## Board

The canvas workspace. Renders all notes with absolute positioning.

### Props

```typescript
interface BoardProps {
  notes: Note[];
  trashRef: RefObject<HTMLElement>;
  onMove: (id: string, position: NotePosition) => void;
  onResize: (id: string, size: NoteSize) => void;
  onDelete: (id: string) => void;
  onEditText: (id: string, text: string) => void;
  onBringToFront: (id: string) => void;
}
```

### Layout

- `position: relative` — coordinate space for absolute notes
- Full viewport minus toolbar height and trash zone height
- Background: light neutral (#fafafa) with optional subtle dot grid

---

## Toolbar

Top bar with note creation controls.

### Props

```typescript
interface ToolbarProps {
  selectedColour: NoteColour;
  onColourChange: (colour: NoteColour) => void;
  onAddNote: () => void;
}
```

### Layout

- Fixed top, full width, height ~56px
- Left: App title "Sticky Notes"
- Center: ColorPicker component
- Right: "Add Note" button (+ icon)

---

## ColorPicker

Row of clickable color swatches.

### Props

```typescript
interface ColorPickerProps {
  selectedColour: NoteColour;
  onColourChange: (colour: NoteColour) => void;
}
```

### Behavior

- Renders 5 circular swatches (24x24px)
- Selected swatch has a ring/border indicator
- Colors: yellow, pink, blue, green, orange

---

## TrashZone

Fixed drop target for note deletion.

### Props

```typescript
interface TrashZoneProps {
  isActive: boolean;
}
```

### Ref

- Accepts `React.forwardRef` — parent passes ref for trash detection geometry

### Visual States

| State | Visual |
|---|---|
| Idle | Subtle background, dashed border, trash icon, "Drop here to delete" text |
| Active | Red/pink background, solid border, pulse animation, "Release to delete" text |

### Layout

- Fixed bottom center
- Width ~200px, height ~72px
- Always visible

---

## ResizeHandle

Small visual indicator at bottom-right of a note.

### Props

```typescript
interface ResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
}
```

### Visual

- 16x16px hit area (larger than visual for usability)
- Visual: diagonal lines or small triangle
- Cursor: `nwse-resize`

---

## App

Root component. Composes all children and owns state.

### Responsibilities

- Calls `useNotes()` hook
- Manages `selectedColour` state
- Creates `trashRef`
- Tracks `isAnyNoteDragging` for trash zone active state
- Passes callbacks to children
- Handles `addNote` with randomized position
