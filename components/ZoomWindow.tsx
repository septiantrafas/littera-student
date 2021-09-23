import React, { useEffect } from "react";

// declare var ZoomMtg;
import { ZoomMtg } from "@zoomus/websdk";

// const apiKey = process.env.NEXT_PUBLIC_ZOOM_API_KEY;
// const apiSecret = process.env.NEXT_PUBLIC_ZOOM_API_SECRET;

interface Props {
  meetingNumber: string;
  username: string;
  password?: string;
}

const ZoomWindow: React.FC<Props> = (props) => {
  const { meetingNumber, username, password } = props;

  useEffect(() => {
    ZoomMtg.setZoomJSLib("https://source.zoom.us/1.9.7/lib", "/av");
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareWebSDK();
    // loads language files, also passes any error messages to the ui
    ZoomMtg.i18n.load("en-US");
    ZoomMtg.i18n.reload("en-US");
    document.getElementById("zmmtg-root").style.display = "none";
    // return () => {
    //   cleanup
    // }
  }, []);

  var signatureEndpoint = "/api/getSignature";
  var apiKey = process.env.NEXT_PUBLIC_ZOOM_API_KEY;
  var role = 0;
  var leaveUrl = "http://localhost:3000";
  var userName = username;
  var userEmail = "";
  var passWord = password;
  var registrantToken = ""; // needed for seminar that require registration

  function getSignature(e) {
    e.preventDefault();

    fetch(signatureEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meetingNumber: meetingNumber,
        role: role,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response.signature);
        startMeeting(response.signature);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function startMeeting(signature) {
    document.getElementById("zmmtg-root").style.display = "block";

    ZoomMtg.init({
      leaveUrl: leaveUrl,
      success: (success) => {
        console.log(success);

        ZoomMtg.join({
          signature: signature,
          meetingNumber: meetingNumber,
          userName: userName,
          apiKey: apiKey,
          userEmail: userEmail,
          passWord: passWord,
          tk: registrantToken,
          success: (success) => {
            console.log(success);
          },
          error: (error) => {
            console.log(error);
          },
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  return (
    <>
      <h1>Zoom WebSDK Sample React</h1>

      <button onClick={getSignature}>Join Meeting</button>
    </>
  );
};

export default ZoomWindow;
