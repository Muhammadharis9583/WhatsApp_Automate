var express = require("express");
var router = express.Router();
const multer = require("multer");
const { qrcode, sendMessage, sendImage, sendBulk, sendFile, sendVideo, recievedMessage, test } = require("../controllers/Qrcode");
const upload = multer({});
clientSessions = {};
router.get("/qrcode/:number",qrcode );

router.get("/test",test);

router.post("/send/:session/:message/:to", sendMessage);

router.post("/sendImg", upload.single("image"),sendImage);

router.post("/bulksend", sendBulk);

router.post("/sendfile", upload.single("file"),sendFile );

router.post("/sendvideo", upload.single("file"), sendVideo);

router.get("/recieved/:session", recievedMessage);
module.exports = router;


// router.post("/sendmssg/:session", async (req, res) => {
//   const client = clientSessions[req.params.session];
//   console.log(client);
//   const message = "HELLO WORLD";
//   const to = "923335662534@c.us";
//   client
//     .sendText(to, message)
//     .then((result) => {
//       console.log("Result: ", result); //return object success
//       res.send("Message Sent");
//     })
//     .catch((erro) => {
//       console.error("Error when sending: ", erro); //return object error
//       res.send("Message Not Sent");
//     });
// });