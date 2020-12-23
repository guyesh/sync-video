import firebase from "../firebase";

var database = firebase.database().ref();
var yourVideo = document.getElementById("yourVideo");
var friendsVideo = document.getElementById("friendsVideo");
var friendsVideo2 = document.getElementById("friendsVideo2");
var yourId = Math.floor(Math.random() * 1000000000);
//Create an account on Viagenie (http://numb.viagenie.ca/), and replace {'urls': 'turn:numb.viagenie.ca','credential': 'websitebeaver','username': 'websitebeaver@email.com'} with the information from your account
var servers = {
  iceServers: [
    { urls: "stun:stun.services.mozilla.com" },
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:numb.viagenie.ca",
      credential: "guy eshel",
      username: "guy@eshel.net",
    },
  ],
};
var pc = new RTCPeerConnection(servers);
pc.onicecandidate = (event) =>
  event.candidate
    ? sendMessage(yourId, JSON.stringify({ ice: event.candidate }))
    : console.log("Sent All Ice");
pc.onaddstream = (event) => {
  friendsVideo.srcObject = event.stream;
  console.log("stream: " + event.stream);
};

function sendMessage(senderId, data) {
  var msg = database.push({ sender: senderId, message: data });
  msg.remove();
}

function readMessage(data) {
  console.log("aaaa: " + data.val().message);
  if (data.val().message == undefined) return;
  var msg = JSON.parse(data.val().message);

  var sender = data.val().sender;
  if (sender != yourId) {
    if (msg.ice != undefined) pc.addIceCandidate(new RTCIceCandidate(msg.ice));
    else if (msg.sdp.type == "offer")
      pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
        .then(() => pc.createAnswer())
        .then((answer) => pc.setLocalDescription(answer))
        .then(() =>
          sendMessage(yourId, JSON.stringify({ sdp: pc.localDescription }))
        );
    else if (msg.sdp.type == "answer")
      pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
  }
}

database.on("child_added", readMessage);
export function updateMyVid(yourvid) {
  yourVideo = yourvid;
}
export function updatefriendVid(frvid) {
  friendsVideo = frvid;
}
export function showMyFace() {
  console.log(yourVideo);
  console.log("hhhh");
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: true })
    .then((stream) => (yourVideo.srcObject = stream))
    .then((stream) => pc.addStream(stream));
}

export function showFriendsFace() {
  pc.createOffer()
    .then((offer) => pc.setLocalDescription(offer))
    .then(() =>
      sendMessage(yourId, JSON.stringify({ sdp: pc.localDescription }))
    );
}
