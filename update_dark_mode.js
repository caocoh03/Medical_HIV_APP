#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Màu cần thay thế và màu mới tương ứng
const colorReplacements = {
  // Background colors
  'backgroundColor: "#f8fafc"': "backgroundColor: theme.colors.background",
  'backgroundColor: "#f6fafd"': "backgroundColor: theme.colors.background",
  'backgroundColor: "#f5f5f5"': "backgroundColor: theme.colors.background",
  'backgroundColor: "#fff"': "backgroundColor: theme.colors.surface",
  'backgroundColor: "white"': "backgroundColor: theme.colors.surface",

  // Text colors
  'color: "#333"': "color: theme.colors.text",
  'color: "#000"': "color: theme.colors.text",
  'color: "#222"': "color: theme.colors.text",
  'color: "#444"': "color: theme.colors.text",
  'color: "#666"': "color: theme.colors.textSecondary",
  'color: "#999"': "color: theme.colors.textSecondary",
  'color: "#ccc"': "color: theme.colors.textTertiary",
  'color: "#aaa"': "color: theme.colors.textTertiary",

  // Primary colors
  'backgroundColor: "#008001"': "backgroundColor: theme.colors.primary",
  'color: "#008001"': "color: theme.colors.primary",

  // Border colors
  'borderColor: "#ddd"': "borderColor: theme.colors.border",
  'borderColor: "#eee"': "borderColor: theme.colors.border",
  'borderColor: "#e0e0e0"': "borderColor: theme.colors.border",

  // Shadow colors
  'shadowColor: "#000"': "shadowColor: theme.colors.shadowColor",
};

function updateFileColors(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    let hasChanges = false;

    // Check if file already imports useThemeMode
    const hasThemeImport = content.includes("useThemeMode");

    // If file doesn't have theme import but has colors to replace, add import
    if (!hasThemeImport) {
      const needsTheme = Object.keys(colorReplacements).some((oldColor) =>
        content.includes(oldColor)
      );

      if (needsTheme) {
        // Add theme import
        const importMatch = content.match(
          /import.*from.*["'].*ThemeContext.*["'];?/
        );
        if (!importMatch) {
          const lastImportIndex = content.lastIndexOf("import");
          if (lastImportIndex !== -1) {
            const endOfLastImport = content.indexOf("\n", lastImportIndex);
            const beforeImport = content.substring(0, endOfLastImport);
            const afterImport = content.substring(endOfLastImport);
            content =
              beforeImport +
              '\nimport { useThemeMode } from "../../context/ThemeContext";' +
              afterImport;
            hasChanges = true;
          }
        }

        // Add theme hook if component doesn't have it
        const componentMatch = content.match(
          /export default function \w+\([^)]*\) \{/
        );
        if (
          componentMatch &&
          !content.includes("const { theme } = useThemeMode();")
        ) {
          const componentStart =
            componentMatch.index + componentMatch[0].length;
          const beforeComponent = content.substring(0, componentStart);
          const afterComponent = content.substring(componentStart);
          content =
            beforeComponent +
            "\n  const { theme } = useThemeMode();" +
            afterComponent;
          hasChanges = true;
        }
      }
    }

    // Replace colors
    for (const [oldColor, newColor] of Object.entries(colorReplacements)) {
      if (content.includes(oldColor)) {
        content = content.replace(
          new RegExp(oldColor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
          newColor
        );
        hasChanges = true;
      }
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated: ${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
    return false;
  }
}

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      callback(filePath);
    }
  });
}

// Update all screens
const screensDir = path.join(__dirname, "app", "screens");
if (fs.existsSync(screensDir)) {
  console.log("Updating screen files...");
  let updatedCount = 0;
  walkDir(screensDir, (filePath) => {
    if (updateFileColors(filePath)) {
      updatedCount++;
    }
  });
  console.log(`Updated ${updatedCount} screen files.`);
} else {
  console.log("Screens directory not found");
}

// Update components
const componentsDir = path.join(__dirname, "app", "components");
if (fs.existsSync(componentsDir)) {
  console.log("Updating component files...");
  let updatedCount = 0;
  walkDir(componentsDir, (filePath) => {
    if (updateFileColors(filePath)) {
      updatedCount++;
    }
  });
  console.log(`Updated ${updatedCount} component files.`);
} else {
  console.log("Components directory not found");
}

console.log("Dark mode update completed!");
