# Walkthrough - Analytics Integration with GTM

I have successfully connected Google Tag Manager (GTM) to the HairCare-Comparator application to provide statistics and simple behavioral analytics.

## Changes Made

### 1. Tagging & Infrastructure
- Added Google Tag Manager container (GTM-55XRGQLJ) to [index.html](file:///Users/marekgraniszewski/Documents/code/HairCare-Comparator/HairCare-Comparator/index.html).
- Created a utility [gtm.ts](file:///Users/marekgraniszewski/Documents/code/HairCare-Comparator/HairCare-Comparator/src/utils/gtm.ts) for pushing data to `dataLayer`.

### 2. Automatic Page View Tracking
- Integrated an `AnalyticsTracker` component in [App.tsx](file:///Users/marekgraniszewski/Documents/code/HairCare-Comparator/HairCare-Comparator/src/App.tsx) that automatically captures page views on every route change (including search parameters).

### 3. Event Tracking Integration
- Enhanced the existing tracking library [track.ts](file:///Users/marekgraniszewski/Documents/code/HairCare-Comparator/HairCare-Comparator/src/lib/track.ts) to push all events to GTM.
- This automatically enables tracking for:
  - **Product List Views** (`view_list`)
  - **Product Detail Views** (`view_product`)
  - **Filter Changes** (`filter_change`)
  - **Quiz Start & Completion** (`quiz_start`, `quiz_complete`)
  - **Outbound Clicks** to shops (`outbound_click`) - tracking merchant name and price.

## Verification

- [x] GTM Snippet present in `<head>` and `<body>`.
- [x] Route changes trigger `page_view` events in `dataLayer`.
- [x] User interactions trigger custom events with appropriate payloads.

render_diffs(file:///Users/marekgraniszewski/Documents/code/HairCare-Comparator/HairCare-Comparator/index.html)
render_diffs(file:///Users/marekgraniszewski/Documents/code/HairCare-Comparator/HairCare-Comparator/src/App.tsx)
render_diffs(file:///Users/marekgraniszewski/Documents/code/HairCare-Comparator/HairCare-Comparator/src/lib/track.ts)
