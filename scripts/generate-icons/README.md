# Icon Generation Script Documentation (`index.js`)

## Overview

This script is responsible for managing the application's icon system. It automates the process of converting raw SVG files into a TypeScript registry (`data.ts`) containing the icon content string. This allows for:

1.  **Zero Runtime HTTP Requests**: Icons are bundled with the app.
2.  **Tree Shaking/Optimization**: Only icons actually referenced in the code are included in the bundle.
3.  **Strict Typing**: Generates a TypeScript type `IconName` matching the available icons.

## Key Paths

- **Source SVGs**: `../src/assets/img/svg/*.svg`
- **Scan Directory**: `../src/app` (Recursive scan of `.html` and `.ts` files)
- **Output File**: `../src/app/core/ui/ui-icon/data.ts`

## Workflow description

1.  **Load SVGs**:
    - Reads all `.svg` files from the source directory.
    - Minifies the content (removes newlines, whitespace, XML declaration).
    - Stores them in memory as candidates.

2.  **Usage Detection (Native Implementation)**:
    - Recursively walks through the `Scan Directory`.
    - Reads every `.html` and `.ts` file.
    - Performs a simple string inclusion check: does the file contain `'icon-name'` or `"icon-name"`?
    - _Note_: This relies on icons being referenced by their exact string name (e.g. `name="folder"`).

3.  **Filtering**:
    - Icons that are NOT found in step 2 are excluded from the final object.
    - Unused icons are logged to the console to inform the developer.

4.  **Generaton**:
    - Writes `export const ICONS = { ... } as const;` to the output file.
    - Writes `export type IconName = keyof typeof ICONS;` to allow strict typing in components.

## Maintenance Guide for AI Agents

- **Adding Features**: If you need to add more sophisticated parsing (e.g. AST parsing), try to keep it dependency-free if possible, or ensure the user allows external packages (`glob`, `fs-extra`, etc.). Currently, it uses **only native Node.js modules** (`fs`, `path`).
- **Formatting**: The script uses ANSI escape codes (`\x1b[...]`) for colored console output. Ensure any new logs follow this pattern for consistency.
- **Performance**: The current string-search approach is fast for typical project sizes. If the project grows massive, consider optimizing the file scanning (e.g., ignoring `spec.ts` files).

## Dependencies

- **None** (Uses standard Node.js `fs` and `path` modules).
