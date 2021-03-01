import dynamic from "next/dynamic";

// ZoomWindow component should be rendered on client (SSR breaks Zoom WebSDK)
const ZoomWindow = dynamic(() => import("../components/ZoomWindow"), {
  ssr: false,
});

import PageWithLayoutType from "../types/pageWithLayout";

import Default from "../layouts/default";

const Meeting: React.FC = () => {
  return (
    <>
      <ZoomWindow />
    </>
  );
};

(Meeting as PageWithLayoutType).layout = Default;

export default Meeting;
