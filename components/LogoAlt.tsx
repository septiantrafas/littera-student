import { chakra, HTMLChakraProps, useToken } from "@chakra-ui/react";
import * as React from "react";

export const LogoAlt = (
  props: HTMLChakraProps<"svg"> & { iconColor?: string }
) => {
  const { iconColor = "currentColor", ...rest } = props;
  const color = useToken("colors", iconColor);
  return (
    <chakra.svg viewBox="0 0 352 346" fill="none" {...rest}>
      <rect width="107" height="346" fill={color} />
      <path d="M352 98.5V0H222C231.5 69.5 276 107 352 98.5Z" fill="#EA212D" />
      <path d="M352 203.5V346H107L352 203.5Z" fill={color} />
    </chakra.svg>
  );
};
