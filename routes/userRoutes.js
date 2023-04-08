var express = require("express");
var router = express.Router();
const multer = require("multer");
const { qrcode, sendMessage, sendImage, sendBulk, sendFile, sendVideo, recievedMessage, test } = require("../controllers/Qrcode");
const upload = multer({});

router.get("/qrcode/:number",qrcode );

router.get("/test",test);

router.post("/send/:session", sendMessage);

router.post("/sendImg/:session", upload.single("image"),sendImage);

router.post("/bulksend/:session", sendBulk);

router.post("/sendfile/:session", upload.single("file"),sendFile );

router.post("/sendvideo/:session", upload.single("file"), sendVideo);

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