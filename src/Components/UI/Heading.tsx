import React, { ReactNode, useMemo } from "react";
import styles from "./heading.module.css";
import classnames from "classnames";
import { UiSize } from "../../PropTypes";

type Props = {
  size?: UiSize;
  children: ReactNode;
  [key: string]: any;
};

export default function Heading({ size = "normal", children, ...rest }: Props) {
  const classNames = useMemo(() => {
    switch (size) {
      case "small":
        return {
          heading: styles.buttonSmall,
        };
      case "large":
        return {
          heading: styles.headingLarge,
        };
      default:
        return {
          heading: styles.heading,
        };
    }
  }, [size]);

  return (
    <div {...rest} className={classnames(classNames.heading, rest?.className)}>
      {children}
    </div>
  );
}
