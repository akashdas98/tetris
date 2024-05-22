import React, { ReactNode } from "react";
import styles from "./button.module.css";

export interface ButtonPropTypes {
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
  onClick?: (...args: any[]) => any;
  [key: string]: any;
}

export default function Button(props: ButtonPropTypes) {
  const { label, iconLeft, iconRight, onClick, children, ...rest } = props;

  return (
    <button className={styles.button} onClick={onClick} {...rest}>
      {iconLeft && <span style={{ marginRight: "8px" }}>{iconLeft}</span>}
      <span>{children}</span>
      {iconRight && <span style={{ marginLeft: "8px" }}>{iconRight}</span>}
    </button>
  );
}
