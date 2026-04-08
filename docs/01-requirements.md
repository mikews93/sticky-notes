# Product Requirements — Sticky Notes SPA

## Overview

A single-page web application for creating, managing, and organizing sticky notes on a free-form canvas. Desktop-only, minimum 1024x768 resolution. Supported browsers: latest Chrome (Windows/Mac) and Firefox (all platforms).

---

## Core Features

### F1: Create Note

**User Story:** As a user, I want to create a new sticky note so that I can capture a thought or task.

**Acceptance Criteria:**
1. WHEN user clicks the "Add Note" button THEN system SHALL create a new note at a default position with the currently selected color and default size (200x180).
2. WHEN a new note is created THEN system SHALL assign it the highest z-index so it appears on top.
3. WHEN a new note is created THEN system SHALL place it at a slightly randomized position near the center of the visible board area to avoid stacking directly on top of previous notes.
4. WHEN the board already has notes THEN system SHALL offset the new note position by a small random amount (20-40px) from the default.

### F2: Resize Note

**User Story:** As a user, I want to resize a note by dragging its corner so that I can adjust it to fit my content.

**Acceptance Criteria:**
1. WHEN user presses and drags the bottom-right resize handle THEN system SHALL update the note's width and height in real-time following the cursor.
2. WHEN user resizes a note below minimum size (120px width, 80px height) THEN system SHALL clamp dimensions to the minimum.
3. WHEN user releases the mouse after resizing THEN system SHALL persist the final size.
4. WHEN user is resizing THEN system SHALL NOT trigger note movement (stopPropagation on resize handle).

### F3: Move Note

**User Story:** As a user, I want to move a note by dragging it so that I can organize my board layout.

**Acceptance Criteria:**
1. WHEN user presses and drags a note's header area THEN system SHALL update the note's position in real-time following the cursor.
2. WHEN user drags a note outside the board boundaries THEN system SHALL clamp the position to keep the note within bounds.
3. WHEN user releases the mouse after dragging THEN system SHALL persist the final position.
4. WHEN user drags quickly and the cursor leaves the note element THEN system SHALL continue tracking the drag via document-level listeners.
5. WHEN user starts dragging THEN system SHALL bring the note to the front (highest z-index).
6. WHEN user is dragging THEN system SHALL prevent text selection on the page.

### F4: Delete Note (Trash Zone)

**User Story:** As a user, I want to delete a note by dragging it to a trash zone so that I can remove notes I no longer need.

**Acceptance Criteria:**
1. WHEN user drags a note over the trash zone THEN system SHALL provide visual feedback on both the note (red border, reduced opacity) and the trash zone (highlighted, active state).
2. WHEN user releases a note while it overlaps the trash zone THEN system SHALL remove the note from the board.
3. WHEN user drags a note away from the trash zone before releasing THEN system SHALL remove the visual feedback and keep the note.
4. WHEN a note is deleted THEN system SHALL persist the deletion (localStorage + API).

---

## Bonus Features

### B1: Edit Note Text

**Acceptance Criteria:**
1. WHEN user clicks on the note body (textarea area) THEN system SHALL enable text editing.
2. WHEN user types in the textarea THEN system SHALL update the note's text content.
3. WHEN user clicks outside the textarea or starts dragging THEN system SHALL save the text.
4. WHEN the note is in dragging state THEN system SHALL NOT allow text editing.

### B2: Bring to Front (Z-Index)

**Acceptance Criteria:**
1. WHEN user clicks or starts dragging any note THEN system SHALL set that note's z-index to the highest value + 1.
2. WHEN multiple notes overlap THEN system SHALL render them according to their z-index order.

### B3: Local Storage Persistence

**Acceptance Criteria:**
1. WHEN the page loads THEN system SHALL restore notes from localStorage.
2. WHEN any note state changes (create, move, resize, edit, delete) THEN system SHALL persist to localStorage within 300ms (debounced).
3. WHEN localStorage data is corrupted or missing THEN system SHALL start with an empty board.

### B4: Note Colors

**Acceptance Criteria:**
1. WHEN user selects a color in the toolbar THEN system SHALL apply that color to the next created note.
2. The system SHALL support 5 colors: yellow (#fff9c4), pink (#f8bbd0), blue (#bbdefb), green (#c8e6c9), orange (#ffe0b2).
3. WHEN no color is selected THEN system SHALL default to yellow.

### B5: REST API Sync

**Acceptance Criteria:**
1. WHEN the page loads THEN system SHALL attempt to fetch notes from `GET /notes` API.
2. IF the API is available THEN system SHALL use API data as the source of truth.
3. IF the API is unavailable THEN system SHALL fall back to localStorage.
4. WHEN note state changes THEN system SHALL sync to the API asynchronously (debounced 1s).
5. The API calls SHALL include a simulated network delay (~300ms).
6. API failures SHALL NOT block the UI or lose data (localStorage is the fallback).

---

## Constraints

| Constraint | Value |
|---|---|
| Min screen resolution | 1024x768 |
| Browsers | Chrome latest (Win/Mac), Firefox latest (all) |
| Note min size | 120px x 80px |
| Note default size | 200px x 180px |
| localStorage debounce | 300ms |
| API sync debounce | 1000ms |
| API simulated delay | 300ms |
| Note colors | 5 (yellow, pink, blue, green, orange) |

---

## Edge Cases

- Creating many notes (20+) should not degrade drag performance.
- Rapid drag movements should track smoothly (document-level listeners).
- Resizing while near the board edge should clamp correctly.
- Deleting the last note should leave an empty board that persists correctly.
- Reloading with an empty localStorage should show an empty board (not crash).
- API server being down should not affect app functionality.
