import React, { useMemo, useState } from "react";
import styles from "./retroButton.module.css";
import Button, { ButtonPropTypes } from "./Button";

export interface RetroButtonPropTypes extends ButtonPropTypes {
  size?: "normal" | "small" | "large";
  borderColor?: string;
  rootProps?: Record<string, any>;
  selected?: boolean;
  selectColor?: string;
  disableSelect?: boolean;
  rootSelectStyle?: React.CSSProperties;
  selectStyle?: React.CSSProperties;
}

export default function RetroButton({
  size = "normal",
  borderColor = "#00ffff",
  rootProps = {},
  selected = false,
  selectColor = "#ffd000",
  disableSelect = false,
  rootSelectStyle = {},
  selectStyle = {},
  ...rest
}: RetroButtonPropTypes) {
  const classNames = useMemo(() => {
    switch (size) {
      case "small":
        return {
          root: styles.rootSmall,
          horizontalBorder: styles.horizontalBorderSmall,
          verticalBorder: styles.verticalBorderSmall,
          button: styles.buttonSmall,
        };
      case "large":
        return {
          root: styles.rootLarge,
          horizontalBorder: styles.horizontalBorderLarge,
          verticalBorder: styles.verticalBorderLarge,
          button: styles.buttonLarge,
        };
      default:
        return {
          root: styles.root,
          horizontalBorder: styles.horizontalBorder,
          verticalBorder: styles.verticalBorder,
          button: styles.button,
        };
    }
  }, [size]);

  const insetBoxShadow = useMemo(() => {
    switch (size) {
      case "small":
        return "8px";
      case "large":
        return "12px";
      default:
        return "16px";
    }
  }, [size]);

  return (
    <div
      {...rootProps}
      className={classNames.root}
      style={{
        ...rootProps?.style,
        transform: selected && !disableSelect ? "scale(1.2)" : undefined,
        transition: !disableSelect ? "transform 0.1s ease" : undefined,
        boxShadow:
          selected && !disableSelect
            ? [
                `inset 0 0 0 ${insetBoxShadow} rgba(0, 0, 0, 1)`,
                "0 0 0 35px rgba(0, 0, 0, 0.3)",
                "0 0 0 25px rgba(0, 0, 0, 0.4)",
                "0 0 0 15px rgba(0, 0, 0, 0.5)",
              ].join(", ")
            : null,
        zIndex: selected && 10,
        ...(selected && !disableSelect && rootSelectStyle),
      }}
    >
      <Button
        {...rest}
        className={classNames.button}
        style={{
          ...rest?.style,
          color: selected && !disableSelect ? selectColor : null,
          ...(selected && !disableSelect && selectStyle),
        }}
      />
      <div
        className={classNames.horizontalBorder}
        style={{
          color: borderColor,
        }}
      />
      <div
        className={classNames.verticalBorder}
        style={{
          color: borderColor,
        }}
      />
    </div>
  );
}
