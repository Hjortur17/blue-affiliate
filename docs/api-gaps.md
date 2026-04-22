# Blue Desk API Gaps

Fields referenced by the updated designs that are either missing or inconsistent in the current Blue Desk API responses. Please confirm or add these.

## Dashboard summary (`GET /v1/affiliate/dashboard/`)

The new stat-card design shows a "+X% from last month" line on **every** card (Total Bookings, Total Revenue, Expected Commission, Total Clicks — and Total Deliveries / Total Commission on the delivery tab). Currently only `totalBookings.changePercent` is required; the rest are optional and not being returned.

Please make the following fields **required** on the dashboard response:

- `totalRevenue.changePercent: number` — month-over-month change, signed (positive or negative).
- `expectedCommission.changePercent: number` — month-over-month change, signed.
- `totalClicks.changePercent: number` — month-over-month change, signed.

For consistency, these should follow the same convention as the existing `totalBookings.changePercent` (integer or float, with sign handled by the client).

## Affiliate profile (`POST /v1/affiliate/auth/login` and any future profile endpoint)

The new home-page header shows a banner reading **"Your commission is X%"**, where X is the affiliate's commission rate. There is currently no commission-rate field on `AffiliateProfile`.

Please add:

- `commissionPercent: number` on the `AffiliateProfile` object returned by login (and any profile-refresh endpoint we add later).

Until this is available, the front end is showing the literal string `X%` as a placeholder.

## Notifications

The notifications popover in the new navbar design shows a list of affiliate-facing notifications (payout approved, commission milestone reached, new marketing material, commission confirmed). There is no notifications endpoint today — the client is rendering hard-coded sample data.

To wire this up, we'll need:

- `GET /v1/affiliate/notifications/` — returns a list of notifications with `id`, `title`, `body`, `createdAt` (ISO timestamp), `read` (boolean).
- `POST /v1/affiliate/notifications/mark-all-read` — marks all notifications as read.
- Optional: `POST /v1/affiliate/notifications/:id/read` — marks a single notification as read.

Event types currently shown in the design (for reference — we don't need discriminated types on the client, but the backend may want them): payout approvals, commission milestones, new marketing material, commission confirmations.

## Payouts — pending, confirmed months, per-month breakdown

The Request Payout page has been redesigned around selecting commission months. We need:

### Two summary cards at the top

Add to the `GET /v1/affiliate/payouts/` response:

- `pendingAmount: number` — total commission from bookings that haven't been confirmed yet (deliveries still outstanding).
- `confirmedMonths: number` — count of months with fully confirmed deliveries contributing to `availableBalance`.

Both fields are currently typed as optional on the client and render `-` / `0 confirmed months` as placeholders when missing.

### "Select Commission Months" table

The page now shows a table of commission months the affiliate can select to request a payout for. Each row needs:

- `id: string` — a stable identifier (e.g. `"2026-02"`).
- `month: string` — display label (e.g. `"February 2026"`).
- `status: "confirmed" | "pending"` — `confirmed` = all deliveries closed; `pending` = deliveries still ongoing.
- `deliveriesClosed: number`
- `deliveriesTotal: number`
- `commission: number` — commission amount for the month.

Please add either:

- A `months: CommissionMonth[]` field on `GET /v1/affiliate/payouts/`, **or**
- A separate `GET /v1/affiliate/payouts/months/` endpoint returning the list.

Until this ships, the page renders hardcoded sample rows.

### Expandable per-rental breakdown

Each confirmed month row is expandable. When expanded, we show the **individual rentals** that make up the commission for that month. Each rental row needs:

- `id: string` — rental identifier shown as `R-2026-0245`.
- `startDate` + `endDate` — display strings like `"Feb 1"` and `"Feb 5"` (or ISO dates we format client-side).
- `carModel: string`
- `revenue: number` — rental revenue.
- `ratePercent: number` — commission rate applied (e.g. 5).
- `commission: number` — commission earned on this rental.

This can either be embedded on each `CommissionMonth` as `rentals: IndividualRental[]`, or fetched lazily per month (`GET /v1/affiliate/payouts/months/:id/rentals`). Currently the breakdown is entirely fake data in [src/app/(dashboard)/payout/page.tsx](../src/app/(dashboard)/payout/page.tsx) — look for the `// FAKE DATA` comment.

### Payout request payload

`POST /v1/affiliate/payouts/request` currently takes `{ amount }`. With the new flow, the affiliate selects specific months and the payout is tied to those months, not just an arbitrary amount. Please update the request shape to accept:

- `monthIds: string[]` — the list of selected month IDs (matching `CommissionMonth.id`).

The server can compute the total amount from the selected months. The client is currently still sending `{ amount }` (summed from selected months) as a stopgap.

## Affiliate bank account

The Request Payout page now shows a **Bank Account** section in the sidebar with the affiliate's registered payout bank details (holder name, bank name, IBAN, SWIFT/BIC). There is no bank-account endpoint today — the sidebar renders hardcoded sample values.

To wire this up, we'll need:

- `GET /v1/affiliate/bank-account/` — returns the affiliate's bank account with:
  - `holderName: string`
  - `bankName: string`
  - `iban: string`
  - `swift: string | null` — optional; nullable when not provided.
- `PUT /v1/affiliate/bank-account/` — updates the same four fields.

Until this ships, the sidebar uses fake defaults and the Save Changes button is a no-op. Look for the `// FAKE DATA` comment in [src/components/Sidebar.tsx](../src/components/Sidebar.tsx).

## Sub-ID performance

The Performance page has a new "Performance by Sub-ID" table showing how each tracking tag (`?sub=...`) is performing. There is no endpoint for this today — the front end is rendering hardcoded sample rows.

Please add:

- `GET /v1/affiliate/performance/sub-ids/?from=YYYY-MM-DD&to=YYYY-MM-DD` — returns a list of rows, each with:
  - `subId: string` — the tag the affiliate used (`?sub=<value>`)
  - `source: string` — UTM source value (`utm_source`) captured at click time.
  - `medium: string` — UTM medium value (`utm_medium`).
  - `campaign: string` — UTM campaign value (`utm_campaign`).
  - `clicks: number`
  - `bookings: number`
  - `conversionPercent: number` — bookings / clicks × 100
  - `revenue: number` — total revenue attributed to this sub-ID in the range
- Sorted server-side by revenue descending (or whatever is most useful).

## Total Clicks — conversion rate

The old dashboard design showed "Conversion: X%" as a fallback on the Total Clicks card, driven by `totalClicks.conversionPercent`. On the home page the new design no longer surfaces this.

The Performance page, however, now has an "Avg Conversion Rate" stat card that uses `totalClicks.conversionPercent` for the value. It also needs a month-over-month change value for that rate, which is not in the API today.

Please add:

- `totalClicks.conversionChangePercent: number` (or similar) — month-over-month change for the conversion rate, signed, on the same dashboard response. The Performance page renders "±X.X% vs last month" under the Avg Conversion Rate card and is currently showing `+0.0%` as a placeholder.

`totalClicks.conversionPercent` itself should stay — it's still used.
