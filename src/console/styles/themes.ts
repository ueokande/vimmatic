import stylex from "@stylexjs/stylex";
import { colors } from "./tokens.stylex";

export const lightTheme = stylex.createTheme(colors, {
  background: "#ffffff",
  foreground: "#000000",
  secondaryForeground: "#008000",
  commandBackground: "#ffffff",
  commandForeground: "#000000",
  titleBackground: "lightgray",
  titleForeground: "#000000",
  selectBackground: "#ffff00",
  selectForeground: "#000000",
  infoBackground: "#ffffff",
  infoForeground: "#018786",
  errorBackground: "#ff0000",
  errorForeground: "#ffffff",
});

export const darkTheme = stylex.createTheme(colors, {
  background: "#2f474f",
  foreground: "white",
  secondaryForeground: "#86fab0",
  commandBackground: "#052027",
  commandForeground: "white",
  titleBackground: "#052027",
  titleForeground: "white",
  selectBackground: "#eeff41",
  selectForeground: "#000000",
  infoBackground: "#052027",
  infoForeground: "#ffffff",
  errorBackground: "red",
  errorForeground: "white",
});
