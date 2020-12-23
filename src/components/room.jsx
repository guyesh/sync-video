import React, { Component } from "react";
import "../App.scss";
import ReactPlayer from "react-player/lazy";
import Duration from "../duration.js";
import { findDOMNode } from "react-dom";
import topbar from "../IMGS/topBar.svg";
import curtainLeft from "../IMGS/curtainLeft.svg";
import curtainRight from "../IMGS/curtainRight.svg";
import screenfull from "screenfull";
import firebase from "../firebase";
import Jitsi from "react-jitsi";

import JedaiVideoConfig from "../videoChat/jitsiChat";
import {
  BsFullscreenExit,
  BsFullscreen,
  BsPlayFill,
  BsPauseFill,
  BsFillVolumeMuteFill,
  BsFillVolumeUpFill,
} from "react-icons/bs";
//import Chat from "../../videoChat/chat";
export default class Room extends Component {
  state = {
    url: null,
    playing: true,
    mute: false,
    played: 0,
    loaded: 0,
    duration: 0,
    fullscreen: false,
    subs: [],
    suburl:"a",//default value
    AllcomponentFullScreen: false,
    movieName: "",
  };
    //listen to database changes on commponent mount
  componentDidMount() {
    var thisObj = this;
    
    //listen to video url cahnges on database
    var urlref = firebase.database().ref("room/url");
    urlref.on("value", function (snapshot) {
      thisObj.setState({ url: snapshot.val() });
    });

    //listen to subs url changes on database
    urlref = firebase.database().ref("room/subsUrl");
    urlref.on("value", function (snapshot) {
      thisObj.setState({suburl:snapshot.val()}) ;//for initial value
      //update subs after object rendered
      if (window.document.getElementById("subs") != null)
        window.document.getElementById("subs").src=snapshot.val();
      
    });

    this.listenToPlayingState();
    setTimeout(() => {
      this.listenToPlayingState();
    }, 5000);
  }
  
  //uptate video url on database
  updateUrl = () => {
    var updates = {};
    updates["room/url"] = this.state.url;
    return firebase.database().ref().update(updates);
  };

  //uptate subtitles url on database
  updateSubsUrl = (url) => {
    var updates = {};
    updates["room/subsUrl"] = url;
    return firebase.database().ref().update(updates);
  };

  getSubs = () => {
    console.log("here");
    const OS = require("opensubtitles-api");
    const OpenSubtitles = new OS("UserAgent");

    OpenSubtitles.search({
      //get subs from modal input filed
      query: window.document.getElementById("moviename").value,
    })
      .then((subtitles) => {
        var subs = [];
        //update subs on state
        subs = Object.values(subtitles);
        this.setState({ subs: subs });
      })
      .catch(console.error);
  };

  handleProgress = (state) => {
    console.log("onProgress", state);
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState(state);
    }
  };
  //updates the duration state
  handleDuration = (duration) => {
    console.log("onDuration", duration);
    this.setState({ duration });
  };

/*--- handle seek functions---*/
  handleSeekMouseDown = (e) => {
    this.setState({ seeking: true });
  };

  handleSeekChange = (e) => {
    this.setState({ played: parseFloat(e.target.value) });
  };
  //update seeking point in database
  handleSeekMouseUp = (e) => {
    this.setState({ seeking: false });
    if (this.player != undefined) {
      this.player.seekTo(parseFloat(e.target.value));

      var updates = {};
      updates["/room/playing"] = this.state.playing;
      updates["/room/played"] = this.state.played;
      return firebase.database().ref().update(updates);
    }
  };

  //video full screen function
  handleClickFullscreen = () => {
    if (this.state.fullscreen) screenfull.exit(findDOMNode(this.playerdiv));
    else screenfull.request(findDOMNode(this.playerdiv));
    this.setState({ fullscreen: !this.state.fullscreen });
  };
  //optinal function for fullscreen for all veiw port
  handleClickFullscreenAllcomponent = () => {
    if (this.state.AllcomponentFullScreen) screenfull.exit(findDOMNode(this));
    else screenfull.request(findDOMNode(this));
    this.setState({ AllcomponentFullScreen: !this.state.fullscreen });
  };

  //update state when database state changes
  listenToPlayingState = () => {
    var thisobj = this;
    var playera = this.player;
    var roomref = firebase.database().ref("/room");
    roomref.on("value", function (snapshot) {
      if (snapshot.val() == null) {
        var updates = {};
        updates["/room/playing"] = false;
        updates["/room/played"] = 0;
        return firebase.database().ref().update(updates);
      } else {
        thisobj.setState({
          played:
            snapshot.val().played != undefined ? snapshot.val().played : 0,
          playing:
            snapshot.val().playing != undefined
              ? snapshot.val().playing
              : false,
        });
      }
      if (playera != undefined)
        playera.seekTo(parseFloat(snapshot.val().played));
    });
  };

  handlePlayPause = () => {
    var updates = {};
    updates["/room/playing"] = !this.state.playing;
    updates["/room/played"] = this.state.played;
    this.setState({ playing: !this.state.playing });
    return firebase.database().ref().update(updates);
  };

  ref2 = (playerdiv) => {
    this.playerdiv = playerdiv;
  };

  ref = (player) => {
    this.player = player;
  };
  handleMovieNameChange(event) {
    //this.setState({ movieName: event.target.value });
  }
  render() {
    return (
      <>
        <button
          className="btn btn-secondary btn-sm m-0"
          style={{ height: "20px", position: "absolute" }}
          type="button"
          data-toggle="modal"
          data-target="#exampleModal"
        >
          settings
        </button>
        <img src={topbar} className="w-100" />
        <div className="bg-Blue">
          <div className="player-container">
            <div
              className="player-wrapper"
              style={{ width: "100%", height: "100%" }}
            >
              <div className="Left-Curtain-contain">
                <img src={curtainLeft} className="leftcurtain" />
              </div>
              <div className="Right-Curtain-contain">
                <img src={curtainRight} className="rightcurtain" />
              </div>

              <div
                className="screen-div"
                onMouseMove={() => {
                  this.setState({ mouseHover: true });
                  setTimeout(() => {
                    this.setState({ mouseHover: false });
                  }, 4000);
                }}
                onMouseLeave={() => this.setState({ mouseHover: false })}
                ref={this.ref2}
              >
                <ReactPlayer
                  className="react-player"
                  url={this.state.url}
                  width="100%"
                  height="100%"
                  ref={this.ref}
                  playing={this.state.playing}
                  muted={this.state.mute}
                  onProgress={this.handleProgress}
                  onDuration={this.handleDuration}
                  config={{
                    file: {
                      attributes: { crossOrigin: "anonymous" },
                      tracks: [
                        {
                          kind: "subtitles",
                          src: this.state.suburl,
                          default: true,
                          id: "subs",
                        },
                      ],
                    },
                  }}
                />

                <div
                  style={{ display: "block" }}
                  className={
                    " mx-auto " +
                    (this.state.fullscreen
                      ? "  fullscreen-range-slider "
                      : " range-slider ") +
                    (this.state.mouseHover ? " fade-in " : " fade-out ")
                  }
                >
                  {" "}
                  <span className="controls my-auto">
                    <span
                      className="m-2"
                      onClick={() => this.handlePlayPause()}
                    >
                      {this.state.playing ? <BsPauseFill /> : <BsPlayFill />}
                    </span>
                    <span
                      className="m-2"
                      onClick={() => this.setState({ mute: !this.state.mute })}
                    >
                      {this.state.mute ? (
                        <BsFillVolumeMuteFill />
                      ) : (
                        <BsFillVolumeUpFill />
                      )}
                    </span>
                  </span>
                  <input
                    class="range-slider__range"
                    type="range"
                    min={0}
                    max={0.999999}
                    step="any"
                    value={this.state.played}
                    onMouseDown={this.handleSeekMouseDown}
                    onChange={this.handleSeekChange}
                    onMouseUp={this.handleSeekMouseUp}
                  />
                  <span class="">
                    <Duration
                      seconds={this.state.duration * this.state.played}
                      className="range-slider__value"
                    />{" "}
                  </span>
                  <span
                    className="m-2 text-white"
                    onClick={() => this.handleClickFullscreen()}
                  >
                    {this.state.fullscreen ? (
                      <BsFullscreenExit />
                    ) : (
                      <BsFullscreen />
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="iframe-containor">
            <JedaiVideoConfig />
          </div>
          {/*<Chat />*/}

          <div
            class="modal fade"
            id="exampleModal"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">
                    Settings
                  </h5>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>

                <form class="m-2 p-4">
                  <div class="form-group row">
                    <label for="videoUrl">Video Url:</label>
                    <div class="col-sm-10">
                      <input
                        type="text"
                        class="form-control"
                        id="videoUrl"
                        placeholder="http://www.ex.com"
                      />
                      <button
                        type="button"
                        class="btn btn-primary"
                        onClick={() => {
                          var url = document.getElementById("videoUrl").value;
                          this.setState(
                            {
                              url: url,
                            },
                            () => this.updateUrl()
                          );
                        }}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="moviename">Movie Name (For subs):</label>
                    <div class="col-sm-10">
                      <input
                        type="text"
                        class="form-control"
                        id="moviename"
                        placeholder="movie name"
                      />
                      <button
                        type="button"
                        class="btn btn-primary"
                        onClick={() => this.getSubs()}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="subsSelect">Select subs</label>
                    <select
                      class="form-control"
                      id="subsSelect"
                      onChange={(e) => {
                        this.updateSubsUrl(e.target.value);        //update subtitles on firebase
                        document.getElementById("subs").src = e.target.value;  //update subs on player
                      }}
                    >
                      <option value="">none</option>
                      {this.state.subs.map((m) => (
                        <option value={m.vtt.replace("http://", "https://")}>
                          {m.filename + "=>" + m.lang}
                        </option>
                      ))}
                    </select>
                  </div>
                </form>

                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
