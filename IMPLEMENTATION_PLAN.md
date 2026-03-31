# Blue Affiliate — API Integration Plan

Replace all hardcoded data with live data from the Blue API affiliate endpoints.

---

## 1. Environment & API Client

### 1.1 Environment Variables

Add `.env.local` (and `.env.example` for documentation):

```
NEXT_PUBLIC_API_URL=http://localhost:3000   # Blue API base URL (public, used client-side)
```

> `NEXT_PUBLIC_` prefix because all data-fetching pages are currently `"use client"`.

### 1.2 API Client (`src/lib/api.ts`)

A thin fetch wrapper that:

- Prepends `NEXT_PUBLIC_API_URL + "/v1/affiliate"` to all paths
- Attaches `Authorization: Bearer <token>` from stored auth state
- Unwraps the `{ data, meta }` envelope — callers receive `data` directly
- Throws typed errors for non-2xx responses, surfacing `error.message` from the API
- Provides typed helper functions for each endpoint:

```ts
// Auth
login(email, password) → { token, affiliate }

// Dashboard
getDashboard(month, year) → DashboardSummary

// Performance
getEngagement(month, year) → { clicksPerDay, bookingsPerDay }
getRentals(month, year) → { upcomingByPickupDate, completedByDropoffDate }

// Payouts
getPayouts() → { availableBalance, history }
requestPayout(amount) → PayoutRecord
```

### 1.3 TypeScript Types (`src/types/api.ts`)

Define response types matching the API schemas. These are plain TypeScript interfaces (no Zod on the client — the API already validates):

```ts
interface AffiliateProfile {
  id: string
  name: string
  email: string
  affiliateLink: string
}

interface LoginResponse {
  token: string
  affiliate: AffiliateProfile
}

interface DashboardSummary {
  totalBookings: { value: number; changePercent: number }
  totalRevenue: { value: number }
  expectedCommission: { value: number }
  totalClicks: { value: number; conversionPercent: number }
  bookingTypeDistribution: { standard: number; premium: number; luxury: number }
  topCars: { rank: number; model: string }[]
}

interface DailyDataPoint {
  date: string  // YYYY-MM-DD
  value: number
}

interface EngagementData {
  clicksPerDay: DailyDataPoint[]
  bookingsPerDay: DailyDataPoint[]
}

interface RentalsData {
  upcomingByPickupDate: DailyDataPoint[]
  completedByDropoffDate: DailyDataPoint[]
}

type PayoutStatus = "Pending" | "Approved" | "Paid" | "Rejected"

interface PayoutRecord {
  id: string
  requestDate: string
  amount: number
  status: PayoutStatus
  paidDate: string | null
}

interface PayoutsData {
  availableBalance: number
  history: PayoutRecord[]
}
```

---

## 2. Authentication

### 2.1 Auth Context (`src/lib/auth.tsx`)

A React context provider that manages:

- `token: string | null` — JWT stored in `localStorage`
- `affiliate: AffiliateProfile | null` — decoded from login response
- `login(email, password)` — calls the API, stores token + affiliate
- `logout()` — clears storage, redirects to `/login`
- `isAuthenticated` — derived boolean
- On mount: reads token from `localStorage`, if expired (decode exp claim) auto-logout

### 2.2 Login Page (`src/app/(auth)/login/page.tsx`)

New route group `(auth)` with its own layout (no sidebar/navbar):

- Email + password form
- Calls `login()` from auth context
- On success, redirects to `/` (dashboard)
- Shows API error messages (invalid credentials)

### 2.3 Auth Layout (`src/app/(auth)/layout.tsx`)

Minimal layout for the login page — centered card, Blue branding, no sidebar.

### 2.4 Route Protection

Add an `AuthGuard` component (or use the `(dashboard)/layout.tsx`) that:

- Reads auth context
- If no token → redirect to `/login`
- If token exists → render children

Wire this into the existing `(dashboard)/layout.tsx` so all dashboard pages are protected.

### 2.5 Sidebar Updates

The sidebar currently hardcodes the affiliate link (`www.bluecarrental.is/sfvero`). After login, read `affiliate.affiliateLink` from auth context and display the real link. Same for the "Log out" nav item — wire it to `logout()`.

---

## 3. Period Filter → API Params

The API will accept `month` (1–12) and `year` (e.g. 2026) instead of `from`/`to` date ranges. The current `PeriodFilter` already returns a string like `"February 2026"` which maps naturally to this.

### Approach

Add a utility function in `src/lib/dates.ts` to parse the period string into API params:

```ts
function periodToMonthYear(period: string): { month: number; year: number }
// "February 2026" → { month: 2, year: 2026 }
```

These `{ month, year }` params are sent as query parameters to the dashboard, engagement, and rentals endpoints.

---

## 4. Page-by-Page Integration

### 4.1 Dashboard (`src/app/(dashboard)/page.tsx`)

**API call:** `getDashboard(month, year)` on mount and when period changes.

**Data mapping:**

| API field | Component | Transformation |
|-----------|-----------|----------------|
| `totalBookings.value` | StatsGrid card 1 | `value.toString()` |
| `totalBookings.changePercent` | StatsGrid card 1 subtext | `"+12.5% from last month"`, green if positive, red if negative |
| `totalRevenue.value` | StatsGrid card 2 | `formatPrice(value)` |
| `expectedCommission.value` | StatsGrid card 3 | `formatPrice(value)` |
| `totalClicks.value` | StatsGrid card 4 | `value.toLocaleString()` |
| `totalClicks.conversionPercent` | StatsGrid card 4 subtext | `"Conversion: 3.72%"` |
| `bookingTypeDistribution` | BookingTypesDistribution | Pass `{ standard, premium, luxury }` as props |
| `topCars` | Table | Map to `{ model, bookings: rank }` — note: API returns `rank` not `bookings` count |

**Component changes:**

- `BookingTypesDistribution` — accept a `distribution: { standard: number; premium: number; luxury: number }` prop instead of internal hardcoded data. Compute percentages from the counts.
- Remove all hardcoded stat arrays and `topCarsData`.

**"Delivery Data" tab:** Shows 3 stat cards (Total Bookings, Total Revenue, Total Commission) and the same Top 5 Cars table — no clicks card, no booking type distribution. The current dashboard endpoint covers the Booking Data tab. The Delivery Data tab needs a separate endpoint that doesn't exist yet — we'll use the same `getDashboard()` response for the shared fields (topCars) and leave the delivery-specific stats wired to a future `getDeliveryDashboard(month, year)` endpoint. Until that endpoint exists, the Delivery Data tab will show a placeholder/empty state for its stat cards.

### 4.2 Performance (`src/app/(dashboard)/performance/page.tsx`)

**API calls (both fire in parallel on period change):**
- `getEngagement(month, year)` → clicks/day + bookings/day
- `getRentals(month, year)` → upcoming + completed rentals

**Data mapping:**

| API field | Chart | Key rename |
|-----------|-------|------------|
| `clicksPerDay` | "Clicks per Day" line chart | `{ date, value }` → `{ date: formatShort(date), clicks: value }` |
| `bookingsPerDay` | "Bookings Created per Day" line chart | `{ date, value }` → `{ date: formatShort(date), bookings: value }` |
| `upcomingByPickupDate` | "Upcoming Rentals" bar chart | `{ date, value }` → `{ date: formatShort(date), rentals: value }` |
| `completedByDropoffDate` | "Completed Rentals" line chart | `{ date, value }` → `{ date: formatShort(date), rentals: value }` |

Add a `formatShort` helper to convert `"2026-02-15"` → `"Feb 15"` for chart axis labels.

**Chart axis domains:** Currently hardcoded (`[0, 600]`, `[0, 60]`, etc.). Compute dynamically from the data: `Math.ceil(max * 1.2)` or similar, with sensible tick intervals.

### 4.3 Payout (`src/app/(dashboard)/payout/page.tsx`)

**API calls:**
- `getPayouts()` on mount → balance + history
- `requestPayout(amount)` on form submit

**Data mapping:**

| API field | UI element | Transformation |
|-----------|-----------|----------------|
| `availableBalance` | Balance card | `formatPrice(value)` |
| `history[].requestDate` | Table column | Format `"2026-02-01"` → `"February 1, 2026"` |
| `history[].amount` | Table column | `formatPrice(value)` |
| `history[].status` | Status badge | Map all 4 statuses: Pending, Approved, Paid, Rejected |
| `history[].paidDate` | Table column | Format or show `"-"` if null |

**New behavior:**
- Wire the "Submit Payout Request" button to `requestPayout(amount)`
- Validate minimum amount client-side (10,000 Kr)
- On success, refresh the payout data (re-fetch `getPayouts()`)
- Show API errors (e.g., "Amount exceeds available balance")
- Add Pending and Rejected status badge styles (currently only Paid and Approved are styled)

### 4.4 Academy & Marketing Material

These pages will be powered by Prismic in the future. Leave them as-is with hardcoded content for now.

---

## 5. Loading & Error States

Every page that fetches data needs:

### Loading
- Skeleton placeholders matching the layout of each section (stats grid skeletons, chart skeletons, table row skeletons)
- Use a simple `isLoading` state from each fetch — no need for a global loading library

### Errors
- A reusable inline error component (or reuse the existing `Banner` with `level="error"`)
- Show the error message from the API
- Include a "Retry" button that re-triggers the fetch

### Empty States
- If API returns empty arrays (no bookings, no payout history), show a clean empty state message

---

## 6. File Changes Summary

### New Files
| File | Purpose |
|------|---------|
| `.env.example` | Documents required env vars |
| `src/types/api.ts` | API response TypeScript types |
| `src/lib/api.ts` | API client with typed endpoint functions |
| `src/lib/auth.tsx` | Auth context provider (token + affiliate state) |
| `src/app/(auth)/layout.tsx` | Minimal layout for login |
| `src/app/(auth)/login/page.tsx` | Login page |

### Modified Files
| File | Changes |
|------|---------|
| `src/app/(dashboard)/layout.tsx` | Wrap with AuthProvider, add auth guard redirect |
| `src/app/(dashboard)/page.tsx` | Replace hardcoded data with `getDashboard()` call |
| `src/app/(dashboard)/performance/page.tsx` | Replace hardcoded data with `getEngagement()` + `getRentals()` calls |
| `src/app/(dashboard)/payout/page.tsx` | Replace hardcoded data with `getPayouts()`, wire form to `requestPayout()` |
| `src/components/BookingTypesDistribution.tsx` | Accept distribution data as props |
| `src/components/Sidebar.tsx` | Read affiliate link from auth context, wire logout |
| `src/lib/dates.ts` | Add `periodToMonthYear()` utility |
| `src/types/data.ts` | Update `TopCar` type (remove `bookings`, add `rank`) |

### Unchanged Files
| File | Reason |
|------|--------|
| `src/app/(dashboard)/academy/page.tsx` | No API endpoint |
| `src/app/(dashboard)/marketing-material/page.tsx` | No API endpoint |
| `src/components/StatsGrid.tsx` | Already accepts `stats` as props — no changes needed |
| `src/components/Table.tsx` | Generic — no changes needed |
| `src/components/PeriodFilter.tsx` | Display stays the same, parent handles date conversion |

---

## 7. Implementation Order

Work in this sequence so each step is independently testable:

1. **Types + API client** — `src/types/api.ts`, `src/lib/api.ts`, `.env.example`
2. **Auth** — context, login page, auth guard, sidebar updates
3. **Date utilities** — `periodToMonthYear()` in `src/lib/dates.ts`
4. **Dashboard page** — wire API, update BookingTypesDistribution to accept props
5. **Performance page** — wire both API calls, dynamic chart axes
6. **Payout page** — wire API, form submission, all status styles
7. **Loading/error states** — skeletons, error banners, retry

---

## Decisions

1. **"Delivery Data" tab** — Needs a future API endpoint. Share `topCars` from the existing dashboard endpoint; delivery-specific stats will show a placeholder until the backend adds a delivery dashboard endpoint.
2. **Minimum payout amount** — Hardcode 10,000 Kr client-side for now. Will eventually come from the API.
3. **Token expiry** — Redirect to `/login` on expiry. No silent refresh.
4. **Academy & Marketing Material** — Will be powered by Prismic in the future. Leave hardcoded for now.
