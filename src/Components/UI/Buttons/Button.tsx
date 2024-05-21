import React, { ReactNode } from "react";

export interface ButtonPropTypes {
  label?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
  onClick?: (...args: any[]) => any;
  [key: string]: any;
}

export default function Button(props: ButtonPropTypes) {
  const { label, iconLeft, iconRight, onClick, children, ...rest } = props;

  return (
    <button onClick={onClick} {...rest}>
      {iconLeft && <span style={{ marginRight: "8px" }}>{iconLeft}</span>}
      <span>{children || label}</span>
      {iconRight && <span style={{ marginLeft: "8px" }}>{iconRight}</span>}
    </button>
  );
}
