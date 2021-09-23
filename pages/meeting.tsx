import React from "react";
import dynamic from "next/dynamic";

// ZoomWindow component should be rendered on client (SSR breaks Zoom WebSDK)
const ZoomWindow = dynamic(() => import("@/components/ZoomWindow"), {
  ssr: false,
});

import PageWithLayoutType from "@/types/pageWithLayout";

import Default from "@/layouts/default";

const Meeting: React.FC = () => {
  // https://us02web.zoom.us/j/84824434988?pwd=RGZRUjFzNGhHdWxrTVg5RVFTSHBnZz09
  return (
    <>
      <ZoomWindow
        meetingNumber="84824434988"
        username="Testing"
        password="RGZRUjFzNGhHdWxrTVg5RVFTSHBnZz09"
      />
      {/* <ZoomWindow /> */}
    </>
  );
};

(Meeting as PageWithLayoutType).layout = Default;

export default Meeting;
