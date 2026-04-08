# REST API Specification — Sticky Notes

## Base URL

```
http://localhost:3001
```

Powered by `json-server` watching `db.json`. All calls include a simulated 300ms delay in the client wrapper.

---

## Endpoints

### GET /notes

Retrieve all notes.

**Response:** `200 OK`
```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "position": { "x": 100, "y": 150 },
    "size": { "width": 200, "height": 180 },
    "colour": "yellow",
    "text": "Meeting at 3pm",
    "zIndex": 1,
    "createdAt": 1712534400000,
    "updatedAt": 1712534400000
  }
]
```

**Error:** `500` — Server unavailable → client falls back to localStorage.

---

### POST /notes

Create a new note.

**Request Body:**
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "position": { "x": 100, "y": 150 },
  "size": { "width": 200, "height": 180 },
  "colour": "yellow",
  "text": "",
  "zIndex": 1,
  "createdAt": 1712534400000,
  "updatedAt": 1712534400000
}
```

**Response:** `201 Created` — Returns the created note.

---

### PUT /notes/:id

Update an existing note (full replacement).

**Request Body:** Full `Note` object.

**Response:** `200 OK` — Returns the updated note.

**Error:** `404` — Note not found.

---

### DELETE /notes/:id

Delete a note.

**Response:** `200 OK` — Empty object `{}`.

**Error:** `404` — Note not found.

---

## Client Wrapper

```typescript
interface ApiResponse<T> {
  data: T;
  ok: boolean;
  error?: string;
}
```

All API calls:
1. Add 300ms simulated delay (`setTimeout`)
2. Set `Content-Type: application/json`
3. Return `ApiResponse<T>` wrapping success/failure
4. Log errors to console (never throw to UI)

---

## Data Store

`db.json` at project root:

```json
{
  "notes": []
}
```

### Running the server

```bash
bunx json-server --watch db.json --port 3001
```
