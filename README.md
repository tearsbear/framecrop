# FrameCrop

FrameCrop is a lightweight React image editor for panning, zooming, rotating, and cropping a bundled image with a canvas preview.

## Setup

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` starts the local development server.
- `npm test` runs focused geometry tests.
- `npm run build` type-checks and creates a production build.

## Controls

- Drag the image to position it beneath the 4:3 crop frame.
- Use the zoom controls to scale the image from 100% to 250%.
- Rotate left or right in 90 degree steps.
- Switch between Compact, Default, and Wide editor widths.
- Select Preview Crop to render the current crop to a 480 × 360 canvas.
