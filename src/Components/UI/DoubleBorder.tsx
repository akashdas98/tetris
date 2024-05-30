import React, { CSSProperties, ReactNode, Suspense } from "react";
import theme from "../../theme";

interface Props {
  children: ReactNode;
  innerBorderColor?: string;
  outerBorderColor?: string;
  backgroundColor?: string;
  innerBorderThickness?: string;
  outerBorderThickness?: string;
  gap?: string;
  innerProps?: Record<string, any>;
  [key: string]: any;
}

export default ({
  children,
  innerBorderColor = theme.color.primary,
  outerBorderColor = theme.color.primary,
  backgroundColor = theme.color.background,
  innerBorderThickness = "2px",
  outerBorderThickness = "4px",
  gap = "4px",
  innerProps,
  ...props
}: Props) => {
  const margin = `calc((${innerBorderThickness} + ${gap} + ${outerBorderThickness})) calc(${innerBorderThickness} + ${gap} + ${outerBorderThickness})`;

  const style: CSSProperties = {
    boxShadow: `
      0 0 0 ${innerBorderThickness} ${innerBorderColor}, 
      0 0 0 calc(${innerBorderThickness} + ${gap}) ${backgroundColor}, 
      0 0 0 calc(${innerBorderThickness} + ${gap} + ${outerBorderThickness}) ${outerBorderColor}`,
    margin,
    width: `calc(100% - ((${innerBorderThickness} + ${gap} + ${outerBorderThickness}) * 2))`,
    height: `calc(100% - ((${innerBorderThickness} + ${gap} + ${outerBorderThickness}) * 2))`,
  };

  return (
    <div {...props}>
      <div {...innerProps} style={style}>
        {children}
      </div>
    </div>
  );
};
