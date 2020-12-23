import React, { Component } from "react";
import firebase from "../../firebase";
import {
  showMyFace,
  showFriendsFace,
  updateMyVid,
  updatefriendVid,
} from "./chat.jsx";
export default class Chat extends Component {
  componentDidMount() {
    updateMyVid(this.myvid);
    updatefriendVid(this.frvid);
    showMyFace();
  }
  ref = (myvid) => {
    this.myvid = myvid;
  };
  ref2 = (frvid) => {
    this.frvid = frvid;
  };

  render() {
    return (
      <div>
        <video
          ref={this.ref}
          className="chatvideo"
          id="yourVideo"
          autoPlay
          muted
          playsInline
        ></video>
        <video
          ref={this.ref2}
          className="chatvideo"
          id="friendsVideo"
          autoPlay
          playsInLine
        ></video>

        <br />
        <button
          onClick={() => showFriendsFace()}
          type="button"
          class="btn btn-primary btn-lg"
        >
          <span
            class="glyphicon glyphicon-facetime-video"
            aria-hidden="true"
          ></span>{" "}
          Call
        </button>
        <script src="https://www.gstatic.com/firebasejs/4.9.0/firebase.js"></script>
      </div>
    );
  }
}
