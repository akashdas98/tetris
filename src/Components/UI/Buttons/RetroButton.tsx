import React from "react";

import Button, { ButtonPropTypes } from "./Button";

export default function RetroButton({ rest }: ButtonPropTypes) {
  return (
    <div>
      <Button {...rest} />
    </div>
  );
}
