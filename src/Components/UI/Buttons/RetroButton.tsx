import React, { useMemo, useState } from "react";
import styles from "./retroButton.module.css";
import classnames from "classnames";
import Button, { ButtonPropTypes } from "./Button";
import theme from "../../../theme";

export interface RetroButtonPropTypes extends ButtonPropTypes {
  borderColor?: string;
  selectBorderColor?: string;
  rootProps?: Record<string, any>;
  rootSelectStyle?: React.CSSProperties;
  rootSelectClassName?: string;
}

export default function RetroButton({
  size = "medium",
  borderColor = theme.color.primary,
  selectColor = theme.color.secondary,
  selectBorderColor = theme.color.primary,
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
                `inset 0 0 0 ${theme.size[size].padding} rgba(0, 0, 0, 1)`,
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
        size={size}
      />
      <div
        className={classNames.horizontalBorder}
        style={{
          backgroundColor: selected ? selectBorderColor : borderColor,
        }}
      />
      <div
        className={classNames.verticalBorder}
        style={{
          backgroundColor: selected ? selectBorderColor : borderColor,
        }}
      />
    </div>
  );
}
