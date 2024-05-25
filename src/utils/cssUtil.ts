const generateCssVars = (obj: any, parentKey: string = ""): string => {
  return Object.entries(obj)
    .map(([key, value]) => {
      const newKey = parentKey ? `${parentKey}-${key}` : key;
      if (typeof value === "object" && value !== null) {
        return generateCssVars(value, newKey);
      }
      return `--${newKey}: ${value};`;
    })
    .join("\n");
};

export const getCssVars = (theme: any): string => {
  return `:root {\n${generateCssVars(theme)}\n}`;
};
