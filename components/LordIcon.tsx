import lottie from "lottie-web";
import { defineLordIconElement } from "lord-icon-element";
import { ReactNode } from "react";

// @ts-ignore
defineLordIconElement(lottie.loadAnimation);

interface LordIconProps {
  url: string;
  children?: ReactNode;
}

const LordIcon: React.FC<LordIconProps> = (props) => {
  const { url } = props;

  return (
    // @ts-ignore
    <lord-icon
      src={url}
      trigger="loop"
      colors="primary:#64748b,secondary:#60a5fa"
      stroke="30"
      style={{
        width: "250px",
        height: "250px",
      }}
    />
  );
};

export default LordIcon;
