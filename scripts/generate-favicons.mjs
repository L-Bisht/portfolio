#!/usr/bin/env node

/**
 * Zero-Dependency Fallback Raster Asset Pipeline
 *
 * Generates production-grade fallback raster assets directly from the master vector SVG
 * (public/favicon.svg) using native macOS CLI tooling (sips) and pure binary packaging:
 * 1. public/apple-touch-icon.png (180x180 PNG for Apple Touch / iOS bookmarking)
 * 2. public/favicon.ico (Multi-resolution 16x16, 32x32, 48x48 fallback ICO)
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const rootDir = process.cwd();
const publicDir = path.join(rootDir, "public");
const masterSvgPath = path.join(publicDir, "favicon.svg");
const touchIconPath = path.join(publicDir, "apple-touch-icon.png");
const faviconIcoPath = path.join(publicDir, "favicon.ico");

if (!fs.existsSync(masterSvgPath)) {
  console.error(`Error: Master vector SVG not found at ${masterSvgPath}`);
  process.exit(1);
}

console.log("Starting zero-dependency raster asset generation pipeline...");

// 1. Generate 180x180 Apple Touch PNG
console.log("Generating public/apple-touch-icon.png (180x180) via sips...");
execSync(
  `sips -s format png -z 180 180 "${masterSvgPath}" --out "${touchIconPath}"`,
  { stdio: "pipe" }
);
const touchStat = fs.statSync(touchIconPath);
console.log(`✓ apple-touch-icon.png generated (${touchStat.size} bytes)`);

// 2. Generate multi-resolution ICO file (16x16, 32x32, 48x48)
const icoSizes = [16, 32, 48];
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "favicon-ico-"));
const imageEntries = [];

try {
  for (const size of icoSizes) {
    const tempPngPath = path.join(tempDir, `icon_${size}x${size}.png`);
    execSync(
      `sips -s format png -z ${size} ${size} "${masterSvgPath}" --out "${tempPngPath}"`,
      { stdio: "pipe" }
    );
    const pngBuffer = fs.readFileSync(tempPngPath);
    imageEntries.push({
      width: size,
      height: size,
      buffer: pngBuffer,
    });
  }

  // Assemble standard ICO binary container
  // Header: 6 bytes
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved (must be 0)
  header.writeUInt16LE(1, 2); // Image type: 1 = ICO
  header.writeUInt16LE(imageEntries.length, 4); // Number of images

  // Directory entries: 16 bytes per image
  let currentOffset = 6 + 16 * imageEntries.length;
  const dirEntries = [];

  for (const entry of imageEntries) {
    const dirEntry = Buffer.alloc(16);
    dirEntry.writeUInt8(entry.width >= 256 ? 0 : entry.width, 0);
    dirEntry.writeUInt8(entry.height >= 256 ? 0 : entry.height, 1);
    dirEntry.writeUInt8(0, 2); // Color palette count (0 = no palette / 32bpp)
    dirEntry.writeUInt8(0, 3); // Reserved
    dirEntry.writeUInt16LE(1, 4); // Color planes
    dirEntry.writeUInt16LE(32, 6); // Bits per pixel
    dirEntry.writeUInt32LE(entry.buffer.length, 8); // Image size in bytes
    dirEntry.writeUInt32LE(currentOffset, 12); // Offset of image data
    dirEntries.push(dirEntry);
    currentOffset += entry.buffer.length;
  }

  const icoBuffer = Buffer.concat([
    header,
    ...dirEntries,
    ...imageEntries.map((e) => e.buffer),
  ]);

  fs.writeFileSync(faviconIcoPath, icoBuffer);
  const icoStat = fs.statSync(faviconIcoPath);
  console.log(
    `✓ public/favicon.ico generated (${icoStat.size} bytes, resolutions: ${icoSizes.map((s) => `${s}x${s}`).join(", ")})`
  );
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

console.log("Raster asset pipeline execution completed successfully.");
