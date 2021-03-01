import { extendTheme } from "@chakra-ui/react";

// Global style overrides
// import styles from "./styles";

// Example for foundational style overrides
import colors from "./foundations/colors";
import breakpoints from "./foundations/breakpoints";

// Example for component style overrides
// import Button from "./components/button"

const overrides = {
  // styles,
  colors,
  breakpoints,
  initialColorMode: "light",
  useSystemColorMode: false,
  //   // Other foundational style overrides go here
  //   components: {
  //     Button,
  //     // Other components go here
  //   },
};
export default extendTheme(overrides);
