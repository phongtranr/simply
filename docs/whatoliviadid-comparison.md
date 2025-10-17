# Simply Theme vs. whatoliviadid.com

This document captures a quick audit of Simply's templates and documentation to determine what needs to change to mimic https://whatoliviadid.com/ while keeping archive access prominent.

## Key layout capabilities already available

- **Hero options** – `partials/home/publication-cover.hbs` supports cover hero, latest featured post, or a three-post slider powered by Tiny Slider when `@custom.publication_cover` is set to "Featured Slider". This aligns with the large editorial hero on whatoliviadid.com.
- **Magazine grids** – Both `index.hbs` and `godo-template-featured-slider.hbs` render a multi-column grid via `partials/story/story-grid.hbs`, giving flexibility for image-driven article cards.
- **Archive channel** – `routes.yaml` already exposes `/archive/` using `godo-archive.hbs`, which groups posts by month and year.

## Recent updates

- **Homepage archive strip** – `partials/home/archive-year-strip.hbs` now surfaces distinct years pulled from published posts and is injected on every homepage template when visitors land on page one. Each link scrolls to the matching `#year-YYYY` anchor on `godo-archive.hbs`, recreating whatoliviadid.com’s quick archive navigation.
- **Documentation refresh** – `docs/home.md` calls out the correct archive template, explains the new homepage strip, and documents the Ghost Admin toggle.

## Remaining opportunities

- **Editorial polish** – whatoliviadid.com leans heavily on typography, whitespace, and lifestyle imagery. Fine-tuning Tailwind utility classes in `partials/story/story-grid.hbs` and related components (fonts, spacing, hover states) will help close the visual gap.

## Suggested next steps

1. Adjust Tailwind classes (font families, letter spacing) in story card partials to soften the look and match the reference site's editorial feel.
