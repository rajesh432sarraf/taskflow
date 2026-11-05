# TaskFlow — UI/UX Design Specification

## 1. Design direction

Create a polished, calm, professional productivity SaaS interface. The design should feel like a carefully designed real product, not a generic AI-generated dashboard.

- Light theme only for MVP.
- White surfaces on a soft neutral background.
- Deep charcoal typography.
- Restrained green accent for primary actions and positive states.
- Clear hierarchy and generous spacing.
- Consistent alignment and reusable components.
- No unnecessary gradients, glassmorphism or decorative animations.

## 2. Design tokens

| Token | Value | Use |
|---|---|---|
| Background | `#F7F8FA` | Main app background |
| Surface | `#FFFFFF` | Cards, panels, forms |
| Primary text | `#202938` | Headings and body |
| Secondary text | `#667085` | Supporting labels |
| Accent | `#27845B` | Primary actions, active nav |
| Accent hover | `#206C4A` | Hover state |
| Border | `#E5E7EB` | Dividers and card borders |
| Muted surface | `#F1F3F5` | Secondary controls |
| Danger | `#D64545` | Delete and errors |
| Warning | `#B7791F` | Overdue and caution |

Use semantic status colors consistently:
- Pending: neutral/amber
- In Progress: restrained green/indigo or another accessible distinct tone
- Completed: green
- High priority: red
- Medium priority: amber
- Low priority: neutral

Do not rely on color alone; include text labels.

## 3. Typography and spacing

- Font: Inter if available; system sans-serif fallback.
- Page title: 24–30px, semibold.
- Section title: 16–20px, semibold.
- Body: 14–16px.
- Supporting text: 12–14px.
- Base spacing rhythm: 4px / 8px increments.
- Card radius: 12px.
- Input radius: 8px.
- Button height: approximately 40–44px.

## 4. Application shell

Desktop:
- Fixed or sticky left sidebar, approximately 240px wide.
- Main content fills remaining width.
- Top bar contains page title/context and user menu.
- Main content uses a consistent max-width and spacing.

Mobile:
- Replace persistent sidebar with a compact menu/drawer or bottom navigation.
- Stack statistic cards.
- Task cards become full width.
- Forms fit viewport width without horizontal scrolling.
- Keep primary actions easy to reach.

## 5. Page specifications

### Login
- TaskFlow logo/wordmark.
- Clear heading and short supporting sentence.
- Email and password fields.
- Show/hide password control if practical.
- Primary login button.
- Link to registration.
- Inline validation and API error feedback.

### Register
- Name, email and password fields.
- Clear password requirements.
- Primary create-account button.
- Link to login.
- Prevent duplicate submissions while loading.

### Dashboard
- Greeting and concise subtitle.
- Four summary cards: Total, Pending, In Progress, Completed.
- Recent tasks list.
- Clear "Add task" action.
- Empty state when no tasks exist.
- Counts must be based on the authenticated user only.

### Tasks
- Page heading and Add Task button.
- Search input.
- Status and priority filters.
- Clear-filters action when filters are active.
- Task cards or a compact list with title, due date, priority, status, edit and delete actions.
- Empty state for no tasks and separate no-results state for filters/search.

### Task create/edit form
Fields:
- Title (required)
- Description (optional)
- Priority (Low/Medium/High)
- Status (Pending/In Progress/Completed)
- Due date (optional)

Use clear labels, inline validation, disabled/loading submit state, cancel action and success/error feedback.

## 6. Component rules

Build reusable components:
- `AppLayout`
- `Sidebar`
- `Topbar`
- `StatCard`
- `TaskCard`
- `TaskForm`
- `SearchInput`
- `FilterBar`
- `ConfirmDialog`
- `Button`
- `Input`
- `Select`
- `EmptyState`
- `LoadingState`
- `ErrorMessage`

Do not create a separate component for every tiny text fragment. Extract components when reuse or clarity improves.

## 7. Interaction states

Every data-driven page must support:
- Initial loading
- Loaded with data
- Empty data
- No search/filter matches
- API error
- Form validation error
- Submit in progress
- Successful operation feedback

Delete must require confirmation. Avoid browser `alert()` for normal product interactions; use a small toast or inline message if practical.

## 8. Accessibility

- Use semantic HTML.
- Associate labels with inputs.
- Ensure keyboard focus is visible.
- Buttons must have descriptive accessible names.
- Maintain readable contrast.
- Do not communicate status through color alone.
- Ensure dialogs can be closed and navigated by keyboard.
- Avoid tiny click targets.

## 9. Design acceptance checklist

- [ ] Looks consistent across all pages.
- [ ] No horizontal overflow at mobile widths.
- [ ] Sidebar/navigation has a clear active state.
- [ ] Forms have labels and validation feedback.
- [ ] Buttons have hover, focus, disabled and loading states.
- [ ] Task status and priority are readable.
- [ ] Dashboard has meaningful empty state.
- [ ] No placeholder links or dead buttons.
- [ ] No fabricated task statistics.
