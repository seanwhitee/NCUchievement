const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

// 定義要打包的 Lambda 函數
const functions = [
  {
    name: "badge-submission",
    entry: "./badge/{badge_id}/submission/index.ts",
    output: "./dist/badge-submission/index.js",
  },
  {
    name: "submission-handler",
    entry: "./submission/{submission_id}/index.ts",
    output: "./dist/submission-handler/index.js",
  },
  {
    name: "review-random",
    entry: "./review/random/index.ts",
    output: "./dist/review-random/index.js",
  },
  {
    name: "review-submission",
    entry: "./review/{submission_id}/index.ts",
    output: "./dist/review-submission/index.js",
  },
];

console.log("📦 Building Lambda functions with esbuild...\n");

// 清理 dist 目錄
const distDir = path.join(__dirname, "..", "dist");
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}

// 逐一打包每個函數
(async () => {
  for (const func of functions) {
    console.log(`📝 Bundling ${func.name}...`);

    // 修改輸出檔案為 .mjs
    const outputFile = func.output.replace(".js", ".mjs");

    try {
      await esbuild.build({
        entryPoints: [func.entry],
        bundle: true,
        platform: "node",
        target: "node18",
        outfile: outputFile,
        minify: false,
        sourcemap: false,
        external: [],
        format: "esm",
        mainFields: ["module", "main"],
        banner: {
          js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
        },
        logLevel: "error",
      });

      const stats = fs.statSync(outputFile);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`✅ ${func.name} - ${sizeKB} KB`);
    } catch (error) {
      console.error(`❌ Error bundling ${func.name}:`, error.message);
      process.exit(1);
    }
  }

  console.log("\n🎉 Build completed successfully!\n");
})();
