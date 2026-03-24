# Blue Affiliate

Affiliate dashboard for Blue Car Rental built with Next.js 16, React 19, Tailwind CSS 4, and shadcn/ui (base-vega style).

## Tech Stack

- **Framework:** Next.js 16 (App Router, RSC enabled)
- **UI:** shadcn/ui (base-vega style) + Base UI React + Lucide icons
- **Styling:** Tailwind CSS 4 with CSS variables for theming
- **Font:** Host Grotesk (via `next/font/google`)
- **Linting/Formatting:** Biome (`npm run lint` / `npm run format`)
- **Language:** TypeScript (strict mode)

## Project Structure

```
src/
├── app/              # Next.js App Router (layout, pages, globals.css)
├── components/       # App-level components (Sidebar, Navbar, StatsGrid, etc.)
│   └── ui/           # shadcn/ui primitives (button, tabs, accordion, etc.)
├── lib/              # Utilities (cn helper via clsx + tailwind-merge)
└── hooks/            # Custom React hooks
```

Path alias: `@/*` maps to `./src/*`

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — Biome check
- `npm run format` — Biome format

## Code Style

- Biome enforces formatting: 2-space indent, 120 char line width, LF endings
- Use `cn()` from `@/lib/utils` for conditional class merging
- Components in `src/components/` use PascalCase filenames
- shadcn/ui primitives live in `src/components/ui/` (lowercase filenames)
- Prefer existing shadcn/ui components before creating new ones
- Icons use the custom `<IconComponent>` wrapper or Lucide directly

### Tailwind Class Discipline

- **Do NOT add Tailwind classes that match the browser/Tailwind default** — only add a class when it changes something. For example, `text-base` (16px) is the default font size; do not write it unless you are explicitly overriding a non-default size set by a parent or ancestor.
- The same rule applies to other defaults: `font-normal`, `text-left`, `leading-normal`, `block` on block-level elements, `static` positioning, etc. Omit them unless they serve as an intentional reset.
- Before adding any utility class, ask: "Would removing this class change the rendered output?" If no, leave it out.

## Design Tokens (Tailwind Theme)

Colors are defined as CSS custom properties in `src/app/globals.css`:

| Token          | Light Value     | Usage                    |
|----------------|-----------------|--------------------------|
| `primary`      | `#155dfc`       | Brand blue, CTAs         |
| `secondary`    | `#fd6112`       | Accent orange, highlights|
| `light-gray`   | `#dcdcdc`       | Borders, dividers        |
| `background`   | `#f8f8f8`       | Page background          |
| `foreground`   | `#121212`       | Primary text             |
| `card`         | white           | Card backgrounds         |
| `card-foreground`| `#101828`     | Card text                |
| `muted-foreground`| `#4a5565`   | Secondary/muted text     |

Use Tailwind classes like `bg-primary`, `text-secondary`, `border-light-gray` — never hardcode hex values.

Border radius base: `0.625rem` with `rounded-sm` through `rounded-4xl` variants.

---

# Figma MCP Workflow

## When given a Figma URL or asked to implement a design:

### Step 1: Understand the Design
1. Call `get_screenshot` first to see the full visual design
2. Call `get_metadata` if you need to discover page structure or find specific frames
3. Call `get_variable_defs` to understand the design token system and map to our Tailwind tokens

### Step 2: Extract Details
4. Call `get_design_context` on the specific frame/component you're building — this is the primary tool for implementation
5. For nested or complex layouts, call `get_design_context` on individual child components as needed
6. Always pass `clientLanguages: "typescript,html,css"` and `clientFrameworks: "react,next"` to all Figma MCP calls

### Step 3: Implement
7. Map Figma values to existing Tailwind theme tokens — never hardcode colors or spacing
8. Use existing shadcn/ui components from `src/components/ui/` wherever possible
9. Figma auto-layout maps to Tailwind Flexbox: `layoutMode` → `flex-row`/`flex-col`, `itemSpacing` → `gap-*`, `padding` → `p-*`
10. Match Figma's spacing to Tailwind's 4px-base scale (e.g., 8px → `2`, 16px → `4`, 24px → `6`)

### Step 4: Verify
11. Call `get_screenshot` again and visually compare against your implementation
12. Check exact values with `get_design_context` if anything looks off
13. Verify you used semantic tokens, not raw values

### Step 5: Register (optional)
14. For reusable components, call `add_code_connect_map` with `label: "React"` to register the Figma-to-code mapping

## Figma URL Handling
- Extract `node-id` from URLs: `https://figma.com/design/:fileKey/:fileName?node-id=1-2` → nodeId `1:2`
- For branch URLs: `https://figma.com/design/:fileKey/branch/:branchKey/:fileName` → use branchKey as fileKey

## Common Pitfalls
- Do NOT skip the screenshot step — always look at the design visually before extracting data
- Do NOT call `get_design_context` on entire pages — target specific frames/components
- Do NOT hardcode hex colors — map to our CSS custom properties in `globals.css`
- Do NOT over-nest components just because Figma's layer tree is deep — flatten where it makes sense
- Do NOT forget responsive behavior — Figma designs are usually for a single viewport; ask about responsive requirements
- If Figma uses a component with variants (hover, disabled, sizes), implement all states, not just the default

## Design Token Mapping (Figma → Tailwind)
When `get_variable_defs` returns Figma variables, map them to our existing tokens:
- Blue brand color → `primary` (`bg-primary`, `text-primary`)
- Orange accent → `secondary` (`bg-secondary`, `text-secondary`)
- Light border gray → `light-gray` (`border-light-gray`)
- Background → `background` (`bg-background`)
- Body text → `foreground` (`text-foreground`)
- Muted text → `muted-foreground` (`text-muted-foreground`)
- Card surfaces → `card` / `card-foreground`

If a Figma variable has no matching token, add it to the `@theme` block in `globals.css` rather than using arbitrary values.
