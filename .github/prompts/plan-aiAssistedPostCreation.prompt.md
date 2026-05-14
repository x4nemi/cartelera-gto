# Plan: AI-assisted post creation (review-and-edit form)

Replace the current accordion-based `publish.tsx` flow with a single scrollable, AI-prefilled review form for the Instagram path. The user pastes an IG link → backend scrapes via Apify + runs a single LLM call that extracts title, dates, time, price, location, category, registration link, age restriction, and contact → the user lands on a long form with every field already filled in and editable. Manual flow stays manual (no AI), reskinned to share the same form UI for consistency. Pending-event cards in the portal show a richer preview using the new fields.

## Phase 1 — Schema & API

**Steps**
1. Extend `PostData` in [src/config/apiClient.ts](src/config/apiClient.ts) with optional fields: `title?: string`, `time?: string` (HH:mm or free text like "20:00 / Puertas 19:30"), `price?: string` (free text — supports "Gratis", "$150", "$150–$300"), `location?: string` (venue name), `category?: string` (one of a fixed list), `registrationUrl?: string`, `ageRestriction?: string` ("Todas las edades" | "+18" | etc.), `contact?: string`. Also add `aiExtracted?: Partial<PostData>` so the UI can show "✨ AI suggested" badges and a "revert" affordance per field.
2. Mirror the same fields into the Cosmos `PostData` shape used by `azure-functions/insertEvent` and `azure-functions/updateEvent` (no schema migration required — Cosmos is schemaless; just make sure the functions don't strip unknown fields). Spot-check `azure-functions/insertEvent/index.js`.
3. Add a fixed `EVENT_CATEGORIES` constant (e.g. `música`, `cine`, `gastronomía`, `arte`, `deporte`, `taller/curso`, `infantil`, `comunidad`, `otro`) in [src/types/index.ts](src/types/index.ts). Reuse this constant in both the form `<Select>` and the LLM prompt.

## Phase 2 — New Azure Function `extractEventDetails` *(parallel with Phase 1)*

**Steps**
4. Create `azure-functions/extractEventDetails/{function.json,index.js}` modeled on `azure-functions/extractDates/index.js`. Same Azure OpenAI client setup (gpt-4o-mini, JSON mode).
5. Single LLM call with a structured-output prompt (Spanish + English caption support) returning JSON: `{ title, dates: {type, dates|daysOfWeek, label}, time, price, location, category (one of EVENT_CATEGORIES), registrationUrl, ageRestriction, contact }`. Each field nullable when missing. Pass the caption + `imageUrls` (vision) so the model can read flyer images, not just text.
6. Endpoint contract: `POST /api/extractEventDetails` with `{ caption?, imageUrls? }` → returns the JSON above plus an `extractedAt` timestamp. Keep the existing `extractDates` function as-is for backwards compatibility (used by `autoDetectEvents` cron).
7. Wire a thin client helper `AiAPI.extractEventDetails(input)` in [src/config/apiClient.ts](src/config/apiClient.ts) next to the other API namespaces.

## Phase 3 — New publish form UI *(depends on Phases 1 & 2)*

**Steps**
8. In [src/pages/publish.tsx](src/pages/publish.tsx), replace the `Accordion` with a two-state layout:
    - **State A (entry):** centered card with the Instagram link input + small "o crea desde cero" link that toggles state into manual mode.
    - **State B (review form):** full-width single scrollable form with sticky `PublishActions` footer.
9. Create new component `src/components/publish/EventForm.tsx`:
    - Header: organizer chip (avatar + @username) and source badge ("desde Instagram" / "manual").
    - Image strip at top — reuse `ImageGallery` / `ImageCarousel`.
    - Fields, in order: Title (Input), Category (Select using `EVENT_CATEGORIES`), Dates (existing `SmartDatePicker`, prefilled), Time (Input or `TimeInput`), Location (Input), Price (Input with quick chips: "Gratis", "$50", "$100", custom), Registration link (Input, URL validation), Age restriction (Select), Contact (Input), Description / caption (Textarea, prefilled).
    - For each AI-prefilled field, render a small `Sparkle` icon + "Sugerido por IA" hint and a "✕" to clear back to empty. Track `aiExtracted` map in form state to know which fields were AI-generated vs user-typed.
    - Validation: title, dates, category required; the rest optional. Disable publish button until required fields are valid.
10. Replace `InstagramPostPreview` and `ManualPostPreview` usages in `publish.tsx` with the unified `EventForm`. Keep `InstagramLinkInput` for the entry step. `ManualPostPreview` and `InstagramPostPreview` can stay in the repo as deprecated for now or be deleted (recommend delete to keep `src/components/publish/` lean).
11. Hook the IG flow: after `createPost(link)` resolves, call `AiAPI.extractEventDetails({ caption: postData.caption, imageUrls: postData.images })` in parallel with the page transition. Show a small inline `Spinner` + "Analizando con IA…" in the form header until extraction resolves, then fade in the prefilled values (use `motion` opacity transition). If extraction fails, just leave fields empty — no blocker.
12. Hook the manual flow: same `EventForm`, but `aiExtracted` stays empty (no AI call). User fills everything by hand. Image upload via existing `AzureStorageAPI.uploadMultipleFiles`.
13. On publish: assemble the full `PostData` with all new fields and call existing `updatePost` / `CosmosAPI.insertEvent`. `inferEventType(dates)` keeps assigning `type` for now — orthogonal to the new `category` field.

## Phase 4 — Portal pending-card preview update *(parallel with Phase 3)*

**Steps**
14. In `src/pages/portal.tsx` pending-events section, extend the card to display (when present): category chip, location, time, price chip ("Gratis" gets a primary color). Keep the existing actions row.
15. The "Editar" button should navigate to publish in edit mode and prefill from the existing draft (currently TODO per the explorer report). Read `?draftId=` in `publish.tsx`, fetch the draft via `CosmosAPI.getEvent(shortCode)`, and skip straight to State B (review form) with all stored fields prefilled. `aiExtracted` markers won't be re-applied (already a stored draft).

## Relevant files
- [src/pages/publish.tsx](src/pages/publish.tsx) — full rewrite of layout; keep `useRequireUser`, `handleCancel`, `handlePublishManual`/`handlePublishPost` logic but unify into one `handlePublish`.
- [src/components/publish/index.ts](src/components/publish/index.ts) — export new `EventForm`; remove old preview components if deleted.
- New: `src/components/publish/EventForm.tsx`.
- [src/components/dates/smartDatePicker.tsx](src/components/dates/smartDatePicker.tsx) — reused inside `EventForm`; small change to accept already-extracted dates so it doesn't re-fetch.
- [src/config/apiClient.ts](src/config/apiClient.ts) — extend `PostData`, add `AiAPI.extractEventDetails`.
- [src/types/index.ts](src/types/index.ts) — add `EVENT_CATEGORIES` constant + type.
- New: `azure-functions/extractEventDetails/{function.json,index.js}` — modeled after `azure-functions/extractDates`.
- [src/pages/portal.tsx](src/pages/portal.tsx) — pending card preview enrichment + edit-link wiring.

## Verification
1. **Schema**: `PostData` typecheck passes; `npm run build` clean.
2. **Function smoke test**: `curl -X POST localhost:7071/api/extractEventDetails -d '{"caption":"Concierto de Café Tacvba viernes 15 de mayo en el Auditorio del Estado, $300, boletos en superboletos.com"}'` returns title="Concierto de Café Tacvba", date 2026-05-15, location includes "Auditorio del Estado", price="$300", registrationUrl includes "superboletos".
3. **IG flow happy path**: paste a real IG link → form opens with all fields prefilled, "Sugerido por IA" badges visible → minor edits → publish → record in Cosmos has all new fields → portal feed shows the new card with category/price chips.
4. **IG flow degraded**: extraction times out → form opens with only `caption`/`images` prefilled, no badges, publish still works.
5. **Manual flow**: form opens empty, no AI badges, all fields editable, image upload works, publish works.
6. **Edit-draft flow**: from portal "Editar" on a pending event → publish page opens directly in State B with stored values, no AI call fired.
7. **Portal pending preview**: cards now show category chip, time, location, price; "Gratis" rendered with primary chip.
8. **Mobile responsive**: form fields stack cleanly; sticky footer publish/cancel sits above the bottom navbar (`bottom-20 md:bottom-4`).

## Decisions
- **Single LLM call** (not one per field) for cost + latency. JSON mode w/ vision input.
- **Free-text price** (string) vs structured `{type,amount,currency}` — string is enough for v1; can structure later.
- **`category` is a separate field from `type`**; `type` stays event/workshop/calendar (date-driven) and `category` is the human topic (música, cine…). Both stored.
- **Manual flow stays AI-free** per your choice — keeps the path purely user-driven.
- **Old preview components** (`InstagramPostPreview`, `ManualPostPreview`) recommended for deletion to avoid drift.
- `extractDates` Azure function kept untouched (still used by the cron auto-detect job).

## Further Considerations
1. **Structured price?** Recommend keeping string for now (simpler). Switch to `{ isFree: boolean, amount?: number }` only if you later want filtering by price.
2. **Should AI-extracted values commit silently or require explicit "Aceptar"?** Recommend silent prefill with the per-field "✕" to clear (faster). Alternative: a "Revisar sugerencias" modal before form opens (more friction, more transparent).
3. **City/municipality**: you didn't pick it, but `location` alone may be ambiguous across GTO. Want me to add an optional `city` Select (Guanajuato, León, Irapuato, San Miguel de Allende, …) on top of free-text location? Recommend yes — it's the only way to filter the feed by city later.
