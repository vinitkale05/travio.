import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const publicDir = path.join(repoRoot, "public");
const outputDir = path.join(publicDir, "optimized");
const manifestPath = path.join(repoRoot, "src", "shared", "generated", "media-manifest.ts");

const WIDTHS = [400, 800, 1200];
const BUDGETS = {
  hero: 250 * 1024,
  card: 120 * 1024,
  thumbnail: 50 * 1024,
};

const ASSETS = [
  { key: "marketingHero", source: "hero-section.png", usage: "hero" },
  { key: "dashboardPreview", source: "dashboard-preview.png", usage: "hero" },
  { key: "curatedMountains", source: "hero-section.png", usage: "card" },
  { key: "curatedBeach", source: "dashboard-preview.png", usage: "card" },
  { key: "avatarHitesh", source: "hitesh.jpg", usage: "thumbnail" },
  { key: "avatarPiyush", source: "piyush.jpg", usage: "thumbnail" },
  { key: "avatarAnirudh", source: "anirudh.jpg", usage: "thumbnail" },
  { key: "avatarChaicode", source: "Chaicode.jpg", usage: "thumbnail" },
];

function getQuality(usage, format) {
  if (usage === "hero") {
    return format === "avif" ? 48 : 68;
  }

  if (usage === "thumbnail") {
    return format === "avif" ? 42 : 58;
  }

  return format === "avif" ? 45 : 62;
}

function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

async function ensureDirectories() {
  await mkdir(outputDir, { recursive: true });
  await mkdir(path.dirname(manifestPath), { recursive: true });
}

async function generateBlurData(inputPath) {
  const buffer = await sharp(inputPath)
    .resize(20, 20, { fit: "cover" })
    .webp({ quality: 35 })
    .toBuffer();

  return `data:image/webp;base64,${buffer.toString("base64")}`;
}

function assertBudget(fileSize, usage, outputFile) {
  const limit = BUDGETS[usage];
  if (fileSize > limit) {
    throw new Error(
      `Image budget exceeded for ${outputFile}. Received ${fileSize} bytes, limit is ${limit} bytes.`,
    );
  }
}

async function buildAsset(asset) {
  const inputPath = path.join(publicDir, asset.source);
  const blurDataURL = await generateBlurData(inputPath);
  const output = {
    usage: asset.usage,
    source: `/${asset.source}`,
    blurDataURL,
    avif: {},
    webp: {},
  };

  for (const width of WIDTHS) {
    for (const format of ["avif", "webp"]) {
      const filename = `${asset.key}-${width}.${format}`;
      const outputPath = path.join(outputDir, filename);
      const transformer = sharp(inputPath).resize({
        width,
        fit: "cover",
        withoutEnlargement: true,
      });

      const pipeline =
        format === "avif"
          ? transformer.avif({ quality: getQuality(asset.usage, format), effort: 6 })
          : transformer.webp({ quality: getQuality(asset.usage, format), effort: 6 });

      const info = await pipeline.toFile(outputPath);
      assertBudget(info.size, asset.usage, filename);
      output[format][width] = toPosix(`/optimized/${filename}`);
    }
  }

  return [asset.key, output];
}

async function main() {
  await ensureDirectories();

  const manifestEntries = await Promise.all(ASSETS.map(buildAsset));
  const manifestObject = Object.fromEntries(manifestEntries);

  const source = `export const mediaManifest = ${JSON.stringify(manifestObject, null, 2)} as const;\n\nexport type MediaManifestKey = keyof typeof mediaManifest;\n`;
  await writeFile(manifestPath, source, "utf8");

  console.log(`Optimized ${ASSETS.length} image assets into ${toPosix(outputDir)}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
