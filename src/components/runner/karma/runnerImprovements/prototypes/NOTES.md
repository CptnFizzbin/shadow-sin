# Spend Karma dialog — mobile layout prototypes

**Question:** which navigation structure should the Spend Karma (improvements) dialog use
when horizontal space is constrained (phones)? The current 96px left nav rail eats roughly
a quarter of the dialog width on a 360–390px viewport.

**How to view:** open any runner → Karma section → *Spend Karma*. Flip variants with the
floating bar at the bottom of the screen (wraps around). All variants go full-screen below
the `sm` breakpoint — use responsive dev tools or a phone to judge them. Queued
improvements carry across variant switches (except the baseline, which keeps its own queue).

## Variants

1. **Current (left rail)** — baseline; the existing `spendKarmaDialogContent.tsx` untouched.
2. **Scrollable tabs** — horizontally scrollable icon+label tabs pinned under the title;
   content gets the full dialog width. Least structural change from today.
3. **Bottom nav** — mobile-app pattern: X (cancel) and Save in the header, budget strip
   above the content, section switching via a bottom icon bar. No footer button row.
4. **Accordions** — no navigation chrome; all sections stacked in one scroll as
   accordions. Collapsed headers show a green karma chip with that section's queued cost.
5. **Drill-down** — hub-and-spoke: a category list with queued badges; tapping a category
   replaces the view with that section and a back button in the title.

## Verdict

_Pending — fill in the winning variant (or the mix of bits to combine) before deleting
this directory and folding the result into `spendKarmaDialogContent.tsx`._
