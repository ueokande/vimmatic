export type ThemeProperties = {
  background: string;
  foreground: string;
  secondaryForeground: string;
  command: {
    background: string;
    foreground: string;
  };
  title: {
    background: string;
    foreground: string;
  };
  select: {
    background: string;
    foreground: string;
  };
  info: {
    background: string;
    foreground: string;
  };
  error: {
    background: string;
    foreground: string;
  };
};

export const LightTheme: ThemeProperties = {
  background: "#ffffff",
  foreground: "#000000",
  secondaryForeground: "#008000",
  command: {
    background: "#ffffff",
    foreground: "#000000",
  },
  title: {
    background: "lightgray",
    foreground: "#000000",
  },
  select: {
    background: "#ffff00",
    foreground: "#000000",
  },
  info: {
    background: "#ffffff",
    foreground: "#018786",
  },
  error: {
    background: "#ff0000",
    foreground: "#ffffff",
  },
};

export const DarkTheme: ThemeProperties = {
  background: "#2f474f",
  foreground: "white",
  secondaryForeground: "#86fab0",
  command: {
    background: "#052027",
    foreground: "white",
  },
  title: {
    background: "#052027",
    foreground: "white",
  },
  select: {
    background: "#eeff41",
    foreground: "#000000",
  },
  info: {
    background: "#052027",
    foreground: "#ffffff",
  },
  error: {
    background: "red",
    foreground: "white",
  },
};
