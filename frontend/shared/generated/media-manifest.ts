export const mediaManifest = {
  "marketingHero": {
    "usage": "hero",
    "source": "/hero-section.png",
    "blurDataURL": "data:image/webp;base64,UklGRqoAAABXRUJQVlA4IJ4AAADwBACdASoUABQAPwFwrFErJiQiqA1RYCAJbACdL4Bs/wDcMD3l6YU3zp4mhGYGtgAAyzTlJJoJiz+J8QtekS8ChB0rRjg9V8lCLcQTBJ5P438Wywb6SOi+PSZfXngj5N9t3X/fQs9APwVon5+cVbIswyCRSp/Vjthg1KHsvt+bQCy7Y1fs8hFTJmpPf3XSiUt6sAiGlwFXdArVBlYAAA==",
    "avif": {
      "400": "/optimized/marketingHero-400.avif",
      "800": "/optimized/marketingHero-800.avif",
      "1200": "/optimized/marketingHero-1200.avif"
    },
    "webp": {
      "400": "/optimized/marketingHero-400.webp",
      "800": "/optimized/marketingHero-800.webp",
      "1200": "/optimized/marketingHero-1200.webp"
    }
  },
  "dashboardPreview": {
    "usage": "hero",
    "source": "/dashboard-preview.png",
    "blurDataURL": "data:image/webp;base64,UklGRpIAAABXRUJQVlA4IIYAAABwBACdASoUABQAPwFurlCrJiQiqA1RYCAJagCpJ2Wv/gHnCOhFrcOsFp8BGgD9Q0iAhTPNC4B75P0jwca9Xissitm9vNsnBma/+6+c4HFb7ew82pmlOD9Ybza4pO3ldrme1kF5d68AOgulTEznhJyz276f0fLt7esCGtBzDDUX6o9c3GAAAA==",
    "avif": {
      "400": "/optimized/dashboardPreview-400.avif",
      "800": "/optimized/dashboardPreview-800.avif",
      "1200": "/optimized/dashboardPreview-1200.avif"
    },
    "webp": {
      "400": "/optimized/dashboardPreview-400.webp",
      "800": "/optimized/dashboardPreview-800.webp",
      "1200": "/optimized/dashboardPreview-1200.webp"
    }
  },
  "curatedRoadTrip": {
    "usage": "card",
    "source": "/hero-bg.jpg",
    "blurDataURL": "data:image/webp;base64,UklGRpwAAABXRUJQVlA4IJAAAAAQBQCdASoUABQAPwFwrFErJiQiqA1RYCAJYgC1ELGA7KN9Cc97pbpXmCNYLbrNACagAP7aXOF+JyCpZiBiOA1mmCq62E82h6Y40sX6MGWoW+uLmynMWGptsoPMbprzys8ygTEB5K0o2T/B1qJwWdMmHJGQ1CzoZoGAKi5uZP7Q1AowfZ/kmb3mAaAHcWEAAAA=",
    "avif": {
      "400": "/optimized/curatedRoadTrip-400.avif",
      "800": "/optimized/curatedRoadTrip-800.avif",
      "1200": "/optimized/curatedRoadTrip-1200.avif"
    },
    "webp": {
      "400": "/optimized/curatedRoadTrip-400.webp",
      "800": "/optimized/curatedRoadTrip-800.webp",
      "1200": "/optimized/curatedRoadTrip-1200.webp"
    }
  },
  "curatedMountains": {
    "usage": "card",
    "source": "/hero-section.png",
    "blurDataURL": "data:image/webp;base64,UklGRqoAAABXRUJQVlA4IJ4AAADwBACdASoUABQAPwFwrFErJiQiqA1RYCAJbACdL4Bs/wDcMD3l6YU3zp4mhGYGtgAAyzTlJJoJiz+J8QtekS8ChB0rRjg9V8lCLcQTBJ5P438Wywb6SOi+PSZfXngj5N9t3X/fQs9APwVon5+cVbIswyCRSp/Vjthg1KHsvt+bQCy7Y1fs8hFTJmpPf3XSiUt6sAiGlwFXdArVBlYAAA==",
    "avif": {
      "400": "/optimized/curatedMountains-400.avif",
      "800": "/optimized/curatedMountains-800.avif",
      "1200": "/optimized/curatedMountains-1200.avif"
    },
    "webp": {
      "400": "/optimized/curatedMountains-400.webp",
      "800": "/optimized/curatedMountains-800.webp",
      "1200": "/optimized/curatedMountains-1200.webp"
    }
  },
  "curatedBeach": {
    "usage": "card",
    "source": "/dashboard-preview.png",
    "blurDataURL": "data:image/webp;base64,UklGRpIAAABXRUJQVlA4IIYAAABwBACdASoUABQAPwFurlCrJiQiqA1RYCAJagCpJ2Wv/gHnCOhFrcOsFp8BGgD9Q0iAhTPNC4B75P0jwca9Xissitm9vNsnBma/+6+c4HFb7ew82pmlOD9Ybza4pO3ldrme1kF5d68AOgulTEznhJyz276f0fLt7esCGtBzDDUX6o9c3GAAAA==",
    "avif": {
      "400": "/optimized/curatedBeach-400.avif",
      "800": "/optimized/curatedBeach-800.avif",
      "1200": "/optimized/curatedBeach-1200.avif"
    },
    "webp": {
      "400": "/optimized/curatedBeach-400.webp",
      "800": "/optimized/curatedBeach-800.webp",
      "1200": "/optimized/curatedBeach-1200.webp"
    }
  }
} as const;

export type MediaManifestKey = keyof typeof mediaManifest;
