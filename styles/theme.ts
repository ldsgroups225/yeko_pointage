export const LightTheme = {
  primary: "#0047AB", // Blue Yeko
  secondary: "#FFA500", // Orange Yeko
  background: "#F5F5F5", // Soft background for readability
  card: "#FFFFFF", // White card for clarity
  text: "#333333", // Dark text for contrast
  textLight: "#666666", // Light grey text for subtitles
  border: "#D8D8D8", // Subtle border color
  notification: "#FF0000", // Red for critical notifications
  rippleColor: "#0000001a", // Soft ripple effect
};

export type ITheme = typeof LightTheme;

export const DarkTheme: ITheme = {
  primary: "#0047AB", // Blue Yeko
  secondary: "#FFA500", // Orange Yeko
  background: "#010101", // Deep black background
  card: "#121212", // Dark card for consistency
  text: "#E5E5E7", // Light text for readability
  textLight: "#FFFFFF", // White text for highlights
  border: "#272729", // Subtle border for dark mode
  notification: "#FF0000", // Red for notifications
  rippleColor: "#ffffff1a", // Light ripple effect
};
