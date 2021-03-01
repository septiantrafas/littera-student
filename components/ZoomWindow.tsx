import React from "react";

import { ZoomMtg } from "@zoomus/websdk";

interface Props {}
interface State {
  id: string;
  username: string;
  password: string;
}

class ZoomWindow extends React.Component<Props, State> {
  componentDidMount() {
    const zoom = ZoomMtg;
    zoom.setZoomJSLib("https://source.zoom.us/1.8.6/lib", "/av");

    zoom.preLoadWasm();
    zoom.prepareJssdk();

    const apiKey = process.env.REACT_APP_API_KEY;
    const apiSecret = process.env.REACT_APP_API_SECRET;
    // The client app should not including API_SECRET on bundle for security reason
    // All function requiring API_SECRET should be handled by server
    console.log("API KEY", apiKey, "API SECRET", apiSecret);

    const meetConfig = {
      apiKey: apiKey,
      meetingNumber: this.state.id,
      userName: this.state.username,
      password: this.state.password, // if required
      role: "0", // 1 for host; 0 for attendee or webinar
    };

    const signature = zoom.generateSignature({
      meetingNumber: meetConfig.meetingNumber,
      apiKey: apiKey,
      apiSecret: apiSecret,
      role: meetConfig.role,
      success: function (res) {
        console.log(res.result);
      },
    });

    zoom.init({
      leaveUrl: "https://zoom.us",
      success: function () {
        console.log("INIT SUCCESS");
        zoom.join({
          meetingNumber: meetConfig.meetingNumber,
          userName: meetConfig.userName,
          signature: signature,
          apiKey: meetConfig.apiKey,
          passWord: meetConfig.password,
          success: function (res) {
            console.log("success joining meeting:", res);
            zoom.getAttendeeslist({});
            zoom.getCurrentUser({
              success: function (res) {
                console.log(
                  "join meeting success getCurrentUser",
                  res.result.currentUser
                );
              },
            });
          },
          error(res) {
            console.log("ERROR:", res);
          },
        });
      },
      error: function (res) {
        console.log("error on init: " + res);
      },
    });
  }

  render() {
    return <></>;
  }
}

export default ZoomWindow;
