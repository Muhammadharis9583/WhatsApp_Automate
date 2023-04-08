const { create, Client, ev } = require("@open-wa/wa-automate");
const fs = require("fs");
var fileupload = require("express-fileupload");

const qrcode = (req, res) => {
  let check = false;
  create({
    sessionId: req.params.number,
    useChrome: true,
    // executablePath: '/usr/bin/google-chrome-stable', // change path as required
  }).then((client) => {
    clientSessions[req.params.number] = client;
    // start(client);
    if (!check) res.send("Phone Connected"); // check to disable this on sending qr code
  });

  ev.on("qr.**", async (qrcode) => {
    // console.log("QR RECEIVED", qrcode);
    const imageBuffer = Buffer.from(
      qrcode.replace("data:image/png;base64,", ""),
      "base64"
    );
    fs.writeFileSync("qr.png", imageBuffer);
    check = true;
    res.sendFile(__dirname + "/qr.png");
  });
};
const sendMessage = async (req, res) => {
  const client = clientSessions[req.params.session];
  const message = req.params.message;
  const to = req.params.to + "@c.us";
  client
    .sendText(to, message)
    .then((result) => {
      console.log("Result: ", result); //return object success
      res.send("Message Sent");
    })
    .catch((erro) => {
      console.error("Error when sending: ", erro); //return object error
      res.send("Message Not Sent");
    });
};

const sendImage = async (req, res) => {
  const { caption, phonenumber, sessionId } = req.body;
  // // var caption="test"
  // // var phonenumber="923335662534@c.us"
  // // var sessionId="03115843266"
  const imgUrl =
    "data:" +
    req.file.mimetype +
    ";base64," +
    req.file.buffer.toString("base64");
  // // //const imgUrl = "https://fastly.picsum.photos/id/791/536/354.jpg?hmac=eXUPs7QLTn9HF78YkhAz85vtEsUXj2aePprZoTCwCdU";

  // if image is not present in the request, return an error
  if (!req.file) {
    return res.status(400).send("No image in the request");
  } else {
    // send the image to the WhatsApp chat
    const client = clientSessions[sessionId];
    client
      .sendImage(phonenumber + "@c.us", imgUrl, "testfile" + "@c.us", caption)
      .then((result) => {
        console.log("Result: ", result); //return object success
        res.send("Image Sent");
      })
      .catch((erro) => {
        console.error("Error when sending: ", erro); //return object error
        res.send("Image Not Sent");
      });
  }
};
const sendBulk = async (req, res) => {
  // phonenumbers => array of phone numbers
  const { message, phonenumbers, sessionId } = req.body;
  const client = clientSessions[sessionId];

  await Promise.all(
    phonenumbers.map(async (number) => {
      await client
        .sendText(number + "@c.us", message)
        .then((result) => {
          console.log("Result: ", result); //return object success
        })
        .catch((erro) => {
          console.error("Error when sending: ", erro); //return object error
        });
    })
  )
    .then((vals) => {
      res.send("Messages Sent");
      console.log(vals);
    })
    .catch(() => {
      res.send("Messages Not Sent");
    });
};
const sendFile = async (req, res) => {
  console.log(req.body);
  const { caption, phonenumber, sessionId } = req.body;
  // console.log(req.body)
  // var caption="test"
  // var phonenumber="923335662534@c.us"
  // var sessionId="03115843266"
  const fileUrl =
    "data:" +
    req.file.mimetype +
    ";base64," +
    req.file.buffer.toString("base64");

  // if image is not present in the request, return an error
  if (!req.file) {
    return res.status(400).send("No file in the request");
  } else {
    // send the file to the WhatsApp chat
    // console.log(req.file)
    const client = clientSessions[sessionId];
    client
      .sendFile(phonenumber + "@c.us", fileUrl, req.file.originalname, caption)
      .then((result) => {
        console.log("Result: ", result); //return object success
        res.send("File Sent");
      })
      .catch((erro) => {
        console.error("Error when sending: ", erro); //return object error
        res.send("File Not Sent");
      });
  }
};
const sendVideo =  async (req, res) => {
  console.log(req.body);
  const { caption, phonenumber, sessionId } = req.body;
  // console.log(req.body)
  // var caption="test"
  // var phonenumber="923335662534@c.us"
  // var sessionId="03115843266"
  const fileUrl =
    "data:" +
    req.file.mimetype +
    ";base64," +
    req.file.buffer.toString("base64");

  console.log(req.file);

  if (!req.file) {
    return res.status(400).send("No video in the request");
  } else {
    // send the file to the WhatsApp chat
    // console.log(req.file)
    const client = clientSessions[sessionId];
    client
      .sendFile(phonenumber + "@c.us", fileUrl, req.file.originalname, caption)
      .then((result) => {
        console.log("Result: ", result); //return object success
        res.send("video Sent");
      })
      .catch((erro) => {
        console.error("Error when sending: ", erro); //return object error
        res.send("video Not Sent");
      });
  }
}
const recievedMessage = (req, res) => {
  const client = clientSessions[req.params.session];
  client.onMessage((message) => {
    console.log(message.body);
    res.send(message.body);
  });
};
const test = (req, res) => {
  // send sessions object
  res.send({ test: true });
  //   res.send(clientSessions);
};
module.exports = {
  test,
  recievedMessage,
  sendVideo,
  sendFile,
  sendBulk,
  sendImage,
  sendMessage,
  qrcode
};