const fs = require('fs');
const path = require('path');

const svgDir = path.join(__dirname, '../../src/assets/img/svg');
const appDir = path.join(__dirname, '../../src/app');
const outputDir = path.join(__dirname, '../../src/app/core/ui/ui-icon');
const outputFile = path.join(outputDir, 'data.ts');

// formatting helpers
const reset = '\x1b[0m';
const bright = '\x1b[1m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const red = '\x1b[31m';
const cyan = '\x1b[36m';

function logHeader(text) {
  console.log(`\n${bright}${cyan}=== ${text} ===${reset}\n`);
}

function formatSize(bytes) {
  return (bytes / 1024).toFixed(2) + ' KB';
}

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      // exclude data.ts from scan to avoid self-reference if checking output dir
      // logic specific for appDir scan, but harmless for svgDir if not present
      if (fullPath !== outputFile) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

try {
  logHeader('Icon System Generation');

  // 1. Load SVGs Recursively
  if (!fs.existsSync(svgDir)) {
    console.error(`${red}SVG directory not found: ${svgDir}${reset}`);
    process.exit(1);
  }

  const allSvgFiles = getAllFiles(svgDir);
  const svgFiles = allSvgFiles.filter((f) => path.extname(f) === '.svg');

  const allIcons = {};
  let totalOriginalSize = 0;

  console.log(`${bright}Found ${svgFiles.length} SVG files in source.${reset}`);

  svgFiles.forEach((filePath) => {
    // Calculate relative path to determine prefix
    // e.g. "filled/alert.svg" or "outline/alert.svg"
    const relativePath = path.relative(svgDir, filePath);
    const dirName = path.dirname(relativePath); // "filled" or "outline" or "."
    const fileName = path.basename(filePath, '.svg');

    // Construct key: folder-filename (e.g. "filled-alert")
    // If file is in root, just use filename
    let iconName = fileName;
    if (dirName !== '.' && dirName !== '') {
      // Normalize separators for nested folders if any (e.g. "filled/social" -> "filled-social")
      const prefix = dirName.split(path.sep).join('-');
      iconName = `${prefix}-${fileName}`;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    totalOriginalSize += content.length;

    // Minify
    content = content
      .replace(/<!--[\s\S]*?-->/g, '') // Remove SVG comments
      .replace(/\r?\n|\r/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    content = content.replace(/<\?xml.*?\?>/, '');

    allIcons[iconName] = content;
  });

  // 2. Scan for Usage
  const sourceFiles = getAllFiles(appDir);
  const usedIcons = new Set();

  console.log(`Scanning ${sourceFiles.length} files for icon usage...`);

  sourceFiles.forEach((file) => {
    const ext = path.extname(file);
    if (['.html', '.ts'].includes(ext)) {
      const content = fs.readFileSync(file, 'utf8');
      Object.keys(allIcons).forEach((icon) => {
        // Check for generic usage: quoted string.
        // This covers:
        // - HTML: name="icon"
        // - TS: icon: 'icon'
        // Matches exact string 'iconName' or "iconName"
        if (content.includes(`'${icon}'`) || content.includes(`"${icon}"`)) {
          usedIcons.add(icon);
        }
      });
    }
  });

  // 3. Filter and Prepare Output
  const finalIcons = {};
  const unusedIcons = [];
  let bundleSize = 0;

  Object.keys(allIcons).forEach((icon) => {
    if (usedIcons.has(icon)) {
      finalIcons[icon] = allIcons[icon];
      bundleSize += allIcons[icon].length;
    } else {
      unusedIcons.push(icon);
    }
  });

  // 4. Generate File
  // Sort keys for deterministic output
  const sortedFinalIcons = Object.keys(finalIcons)
    .sort()
    .reduce((obj, key) => {
      obj[key] = finalIcons[key];
      return obj;
    }, {});

  const tsContent = `export const ICONS = ${JSON.stringify(sortedFinalIcons, null, 2)} as const;\n\nexport type IconName = keyof typeof ICONS;\n`;

  // Ensure dir exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputFile, tsContent);

  // 5. Professional Logging
  logHeader('Generation Report');

  console.log(`${green}✔ Bundle Generated Successfully${reset}`);
  console.log(`  Path: ${outputFile}`);
  console.log(`  Bundle Size: ${formatSize(bundleSize)} (Raw strings)`);
  // Avoid division by zero
  const saving =
    totalOriginalSize > 0 ? ((1 - bundleSize / totalOriginalSize) * 100).toFixed(1) : 0;
  console.log(`  Saved: ${saving}% vs original\n`);

  console.log(`${bright}Usage Statistics:${reset}`);
  console.log(`  Included: ${Object.keys(finalIcons).length}`);
  console.log(`  Unused:   ${unusedIcons.length}`);

  if (unusedIcons.length > 0) {
    console.log(`\n${yellow}Unused Icons (Excluded):${reset}`);
    // Limit output if too many
    if (unusedIcons.length > 20) {
      const shown = unusedIcons.slice(0, 20);
      shown.forEach((icon) => console.log(`  - ${icon}`));
      console.log(`  ... and ${unusedIcons.length - 20} more`);
    } else {
      unusedIcons.forEach((icon) => console.log(`  - ${icon}`));
    }

    console.log(
      `\n${yellow}Tip: Remove these files from src/assets/img/svg (or subfolders) if they are truly obsolete.${reset}`,
    );
  } else {
    console.log(`\n${green}All icons are being used! Good job.${reset}`);
  }
} catch (err) {
  console.error(`\n${red}✖ Failed to generate icons:${reset}`, err);
  process.exit(1);
}
