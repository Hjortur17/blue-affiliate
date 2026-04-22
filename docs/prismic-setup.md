# Prismic Setup Plan

Plan for the Prismic work once Slice Machine access is granted. Source of truth for the custom-type + slice creation.

Scope: content that marketing/content folks should be able to edit without a developer. Dynamic data (dashboard stats, payouts, etc.) stays on the Blue Desk API — see [api-gaps.md](./api-gaps.md).

## Existing custom types (for reference)

Already defined under [`customtypes/`](../customtypes):

- `blog_category` — Name + UID. Referenced from `blog_post.category`.
- `blog_post` — Title, description, featured image, category link, read time, published date, rich-text body. Used on [/academy](../src/app/(dashboard)/academy/page.tsx) and [/academy/blog/[uid]](../src/app/(dashboard)/academy/blog/[uid]/page.tsx).
- `marketing_banner` — Title, image, file size. Used on [/marketing-material](../src/app/(dashboard)/marketing-material/page.tsx).
- `video_tutorial` — Title, description, thumbnail, views, video URL. Used on [/academy](../src/app/(dashboard)/academy/page.tsx).

This project does not currently use slices. FAQ introduces the first slice — the scaffolding that Slice Machine generates (`slices/`, `<SliceZone>`, etc.) will be new to the codebase but is standard Prismic setup.

---

## New for FAQ — slice-based setup

Shape: a single FAQ page document, with a slice zone holding one slice per group. Q&A items live inside the slice itself (no separate `faq_item` documents to reference).

### 1. Custom type: `faq_page` (singleton)

Type: **Single** (not repeatable). Exactly one document exists in Prismic for the whole FAQ page.

| Field | Type | Notes |
|---|---|---|
| `slices` | Slice Zone | Holds the `faq_group` slices. Drag-to-reorder in the Page Builder is the reorder mechanism — no numeric sort field needed. |

No other top-level fields today. If later we want page-level intro copy in Prismic, add `title` / `description` here.

### 2. Slice: `faq_group`

Type: **Slice** (scaffolded into `slices/FaqGroup/`). Used only inside `faq_page.slices`.

**Primary (non-repeatable) fields** — one group header per slice instance:

| Field | Type | Notes |
|---|---|---|
| `title` | Text | Group heading, e.g. "How the Program Works". |
| `description` | Text | One-line subtitle under the title. |

**Items (repeatable) fields** — the Q&A rows inside the group:

| Field | Type | Notes |
|---|---|---|
| `question` | Text | Question headline shown in the collapsed row. |
| `answer` | Rich Text | Allow `paragraph,heading3,heading4,strong,em,hyperlink,list-item,o-list-item`. Renders inside the expanded row. |

Editor flow: open the FAQ page doc → add an `FaqGroup` slice → fill in title/description → add items rows → drag to reorder groups or items.

### Groups to populate

Copy from the current [`faqGroups`](../src/app/(dashboard)/faq/page.tsx) constant. Intended order:

1. **How the Program Works** — _Understanding the Blue Car Rental affiliate program_
   - How does the affiliate program work?
   - Who can join the affiliate program?
   - How do I get started?
   _(Placeholder answers exist in code — should be reviewed / rewritten by marketing before going live.)_
2. **Commission Structure** — _Understanding how you earn and when commissions are confirmed_ _(no items yet)_
3. **Pricing & Revenue** — _How rental pricing works and affects your commission_ _(no items yet)_
4. **Booking & Delivery Status** — _Understanding different status indicators_ _(no items yet)_
5. **Invoicing & Payments** — _How invoicing and payouts work_ _(no items yet)_
6. **Cancellations & Modifications** — _What happens when bookings are cancelled or changed_ _(no items yet)_
7. **Link Tracking & Sub-IDs** — _Optimizing your marketing with tracking parameters_ _(no items yet)_
8. **Best Practices & Tips** — _Maximizing your affiliate earnings_ _(no items yet)_

---

## Staying hardcoded (for now)

These bits of copy live in TSX and won't move to Prismic for this round. Noted here so we can revisit later if the content team wants edit access:

- **"How to Use Marketing Materials"** card on [/marketing-material](../src/app/(dashboard)/marketing-material/page.tsx).
- **"💡 How to use Sub-ID tracking"** card on [/performance](../src/app/(dashboard)/performance/page.tsx).
- **"Important Information"** bullets in the Banner on [/payout](../src/app/(dashboard)/payout/page.tsx).
- Page-level title + description pairs on every top-level page (tied to nav labels, rarely change).

---

## Post-setup code changes

Once `faq_page` and the `faq_group` slice exist and are populated:

1. **Slice Machine scaffold**
   - Slice Machine will generate `slices/FaqGroup/index.tsx` and `slices/FaqGroup/model.json`, and create/update `src/slices/index.ts` (or equivalent).
   - Confirm `babel-plugin-react-compiler` + the existing build still work with the generated files — no known issues.

2. **[src/app/(dashboard)/faq/page.tsx](../src/app/(dashboard)/faq/page.tsx)**
   - Convert to an `async` server component (like `academy/page.tsx`).
   - Replace the hardcoded `faqGroups` constant with:
     ```ts
     const page = await client.getSingle("faq_page").catch(() => null);
     ```
   - Render the slices via `<SliceZone slices={page?.data.slices ?? []} components={components} />` from `@prismicio/react`, with `components` mapping `faq_group` → the new `FaqGroup` slice component.
   - Move the accordion markup from today's `FaqPage` into the slice component (`slices/FaqGroup/index.tsx`). The slice receives `slice.primary.title`, `slice.primary.description`, and `slice.items: { question, answer }[]`.
   - Render `answer` with `PrismicRichText` from `@prismicio/react` instead of a plain string.
   - Remove the `// FAKE DATA` block and the local `FaqGroup` / `FaqItem` types (use Prismic's generated types).

3. **[src/prismicio.ts](../src/prismicio.ts)** — no routes change needed (FAQ isn't deep-linked per item, and the singleton doesn't need a dynamic route).

---

## Out of scope for Prismic

These come from the Blue Desk API (tracked in [api-gaps.md](./api-gaps.md), not here):

- Affiliate profile (name, email, commission rate, affiliate link)
- Dashboard summary stats
- Engagement / rentals chart data
- Performance stats + Sub-ID performance rows
- Payouts (available balance, pending amount, months, history)
- Bank account details
- In-app notifications
