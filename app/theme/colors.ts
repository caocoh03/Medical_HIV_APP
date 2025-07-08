export const lightTheme = {
  colors: {
    primary: "#008001",
    secondary: "#E17055",
    background: "#f6fafd",
    surface: "#ffffff",
    text: "#333333",
    textSecondary: "#666666",
    textTertiary: "#888888",
    border: "#e0e0e0",
    accent: "#007AFF",
    success: "#28a745",
    warning: "#ff9500",
    error: "#dc3545",
    info: "#007bff",

    // Card colors
    cardBackground: "#ffffff",
    cardBorder: "#e0e0e0",

    // Header colors
    headerBackground: "#008001",
    headerText: "#ffffff",

    // Input colors
    inputBackground: "#ffffff",
    inputBorder: "#ddd",
    inputText: "#333",
    inputPlaceholder: "#999",

    // Tab colors
    tabBackground: "#ffffff",
    tabBorder: "#e0e0e0",
    tabIndicator: "#008001",

    // Shadow
    shadowColor: "#000000",
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },

  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },

  fontSize: {
    xs: 11,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
  },
};

export const darkTheme = {
  colors: {
    primary: "#00a001",
    secondary: "#FF7043",
    background: "#121212",
    surface: "#1e1e1e",
    text: "#ffffff",
    textSecondary: "#b3b3b3",
    textTertiary: "#8a8a8a",
    border: "#333333",
    accent: "#4fc3f7",
    success: "#4caf50",
    warning: "#ff9800",
    error: "#f44336",
    info: "#2196f3",

    // Card colors
    cardBackground: "#2d2d2d",
    cardBorder: "#404040",

    // Header colors
    headerBackground: "#1a1a1a",
    headerText: "#ffffff",

    // Input colors
    inputBackground: "#2d2d2d",
    inputBorder: "#404040",
    inputText: "#ffffff",
    inputPlaceholder: "#8a8a8a",

    // Tab colors
    tabBackground: "#1e1e1e",
    tabBorder: "#333333",
    tabIndicator: "#00a001",

    // Shadow
    shadowColor: "#000000",
  },

  spacing: lightTheme.spacing,
  borderRadius: lightTheme.borderRadius,
  fontSize: lightTheme.fontSize,
};

export type Theme = typeof lightTheme;
