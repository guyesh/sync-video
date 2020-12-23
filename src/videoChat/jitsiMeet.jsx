import React from "react";

const JitsiMeetV = () => {
  const domain = "meet.jit.si";
  const meetingName = "roomForMovie";
  const parentElement = document.getElementById("api-parent");
  var options = {
    roomName: meetingName,
    width: "30%",
    height: "11rem",
    marginLeft: "4%",
    overflowY: "visible",
    parentNode: parentElement,
    configOverwrite: { defaultLanguage: "es", prejoinPageEnabled: false },
    interfaceConfigOverwrite: {
      LANG_DETECTION: false,
      lang: "es",
      APP_NAME: "movienight",
      DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
      HIDE_INVITE_MORE_HEADER: true,
      MOBILE_APP_PROMO: false,
      SHOW_CHROME_EXTENSION_BANNER: false,
      SHOW_JITSI_WATERMARK: false,
      BRAND_WATERMARK_LINK: "",
      VIDEO_LAYOUT_FIT: "both",
      VERTICAL_FILMSTRIP: false,
      DISABLE_VIDEO_BACKGROUND: true,
      MAXIMUM_ZOOMING_COEFFICIENT: 1.2,
      LOCAL_THUMBNAIL_RATIO: 16 / 9,
      REMOTE_THUMBNAIL_RATIO: 16 / 9,
      DEFAULT_REMOTE_DISPLAY_NAME: "",
      DEFAULT_BACKGROUND: false,
      GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
      OPEN_IN_MOBILE_BROWSER: true,
      DISABLE_DOMINANT_SPEAKER_INDICATOR: true,
      DISABLE_FOCUS_INDICATOR: true,
      filmStripOnly: true,
      TOOLBAR_BUTTONS: [
        "microphone",
        "camera",
        "fodeviceselection",
        "tileview",
        "download",
        "mute-everyone",
        // 'security'
      ],
    },
  };

  var api = new JitsiMeetExternalAPI(domain, options);
  return <></>;
};
export default JitsiMeetV;
