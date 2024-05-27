import React, { ReactNode } from "react";
import styles from "./box.module.css";
import classnames from "classnames";

type Props = {
  children?: ReactNode;
  [key: string]: any;
};

export default function Box({ children, ...rest }: Props) {
  return (
    <div {...rest} className={classnames(styles.box, rest?.className)}>
      {children}
    </div>
  );
}
