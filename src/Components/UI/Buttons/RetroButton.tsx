import React, { useMemo, useState } from "react";
import styles from "./retroButton.module.css";
import classnames from "classnames";
import Button, { ButtonPropTypes } from "./Button";

export interface RetroButtonPropTypes extends ButtonPropTypes {
  borderColor?: string;
  selectBorderColor?: string;
  rootProps?: Record<string, any>;
  rootSelectStyle?: React.CSSProperties;
  rootSelectClassName?: string;
}

export default function RetroButton({
  size = "normal",
  borderColor = "#00ffff",
  selectColor = "#ffd000",
  selectBorderColor = "#00ffff",
  rootProps = {},
  selected = false,
  disableSelect = false,
  rootSelectStyle = {},
  rootSelectClassName,
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
      className={classnames(
        classNames.root,
        selected && !disableSelect ? rootSelectClassName : null
      )}
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
        selectColor={selectColor}
        selected={selected}
        className={classNames.button}
        style={{
          color: "#ffffff",
          ...rest?.style,
        }}
      />
      <div
        className={classNames.horizontalBorder}
        style={{
          color: selected ? selectBorderColor : borderColor,
        }}
      />
      <div
        className={classNames.verticalBorder}
        style={{
          color: selected ? selectBorderColor : borderColor,
        }}
      />
    </div>
  );
}
