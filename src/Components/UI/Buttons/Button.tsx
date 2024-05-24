import React, { ReactNode, useMemo } from "react";
import styles from "./button.module.css";
import classnames from "classnames";
import { UiSize } from "../../../PropTypes";

export interface ButtonPropTypes {
  size?: UiSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  iconLeftProps?: Record<string, any>;
  iconRightProps?: Record<string, any>;
  children?: ReactNode;
  onClick?: (...args: any[]) => any;
  selected?: boolean;
  selectColor?: string;
  disableSelect?: boolean;
  selectStyle?: React.CSSProperties;
  selectClassName?: string;
  [key: string]: any;
}

export default function Button({
  size = "normal",
  iconLeft,
  iconRight,
  iconLeftProps = {},
  iconRightProps = {},
  onClick,
  children,
  selected = false,
  selectColor,
  disableSelect = false,
  selectStyle = {},
  selectClassName,
  ...rest
}: ButtonPropTypes) {
  const classNames = useMemo(() => {
    switch (size) {
      case "small":
        return {
          iconLeft: styles.iconLeftSmall,
          iconRight: styles.iconRightSmall,
          button: styles.buttonSmall,
        };
      case "large":
        return {
          iconLeft: styles.iconLeftLarge,
          iconRight: styles.iconRightLarge,
          button: styles.buttonLarge,
        };
      default:
        return {
          iconLeft: styles.iconLeft,
          iconRight: styles.iconRight,
          button: styles.button,
        };
    }
  }, [size]);

  return (
    <button
      onClick={onClick}
      {...rest}
      style={{
        ...rest?.style,
        color: selected && !disableSelect ? selectColor : rest?.style?.color,
        ...(selected && !disableSelect && selectStyle),
      }}
      className={classnames(
        classNames.button,
        rest?.className,
        selected && !disableSelect ? selectClassName : null
      )}
    >
      {iconLeft && (
        <span
          className={classnames(classNames.iconLeft, iconLeftProps?.className)}
        >
          {iconLeft}
        </span>
      )}
      <span>{children}</span>
      {iconRight && (
        <span
          className={classnames(
            classNames.iconRight,
            iconRightProps?.className
          )}
        >
          {iconRight}
        </span>
      )}
    </button>
  );
}
