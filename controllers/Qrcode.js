const { create, Client, ev } = require("@open-wa/wa-automate");
const fs = require("fs");
var fileupload = require("express-fileupload");
clientSessions = {};

const qrcode = (req, res) => {
  let check = false;
  create({
    sessionId: req.params.number,
    useChrome: true,
    executablePath: '/usr/bin/google-chrome-stable', // change path as required
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
  // const message = req.params.message;
  // const to = req.params.to + "@c.us";
  const { to, message, countrycode } = req.body;
  if (!client) {
    res.status(400).send("Session Expired");
  } else {
    client
      .sendText(countrycode + to + "@c.us", message)
      .then((result) => {
        console.log("Result: ", result); //return object success
        res.status(200).send("Message Sent to " + phonenumber);
      })
      .catch((erro) => {
        console.error("Error when sending: ", erro); //return object error
        res.status(400).send("Message Not Sent");
      });
  }
};

const sendImage = async (req, res) => {
  const { sessionId } = req.params;
  const { caption, phonenumber, countrycode } = req.body;
  const imgUrl =
    "data:" +
    req?.file?.mimetype +
    ";base64," +
    req?.file?.buffer.toString("base64");
  // // //const imgUrl = "https://fastly.picsum.photos/id/791/536/354.jpg?hmac=eXUPs7QLTn9HF78YkhAz85vtEsUXj2aePprZoTCwCdU";

  if (!req.file || !phonenumber || !countrycode) {
    return res.status(400).send("Invalid Request!");
  } else {
    // send the image to the WhatsApp chat
    const client = clientSessions[sessionId];
    if (!client) {
      res.status(400).send("Session Expired");
    } else {
      client
        .sendImage(countrycode + phonenumber + "@c.us", imgUrl, "testfile" + "@c.us", caption)
        .then((result) => {
          console.log("Result: ", result); //return object success
          res.status(200).send("Image Sent to " + countrycode + phonenumber);
        })
        .catch((erro) => {
          console.error("Error when sending: ", erro); //return object error
          res.status(400).send("Image Not Sent");
        });
    }
  }
};

const sendBulk = async (req, res) => {
  const { sessionId } = req.params;
  // phonenumbers => array of phone numbers
  const { message, phonenumbers } = req.body;
  const client = clientSessions[sessionId];
  if (!client) {
    res.status(400).send("Session Expired");
  } else {
    await Promise.all(
      phonenumbers.map(async (val) => {
        await client
          .sendText(val.ccode + val.number + "@c.us", message)
          .then((result) => {
            console.log("Result: ", result); //return object success
          })
          .catch((erro) => {
            console.error("Error when sending: ", erro); //return object error
          });
      })
    )
      .then((vals) => {
        res.status(200).send("Messages Sent to " + vals.length + " numbers");
        console.log(vals);
      })
      .catch(() => {
        res.status(400).send("Messages Not Sent");
      });
  }
};

const sendFile = async (req, res) => {
  const { sessionId } = req.params;
  const { caption, phonenumber, countrycode } = req.body;

  if (!req.file || !phonenumber || !countrycode) {
    return res.status(400).send("Invalid Request!");
  } else {
    const fileUrl =
      "data:" +
      req?.file?.mimetype +
      ";base64," +
      req?.file?.buffer.toString("base64");

    const client = clientSessions[sessionId];
    if (client === 'undefined') {
      res.status(400).send("Session Expired");
    } else {
      client
        .sendFile(countrycode + phonenumber + "@c.us", fileUrl, req.file.originalname, caption)
        .then((result) => {
          console.log("Result: ", result); //return object success
          res.status(200).send("File Sent to " + phonenumber);
        })
        .catch((erro) => {
          console.error("Error when sending: ", erro); //return object error
          res.status(400).send("File Not Sent");
        });
    }
  }
};

const sendVideo = async (req, res) => {
  const { sessionId } = req.params;
  const { caption, phonenumber, countrycode } = req.body;

  if (!req.file || !phonenumber || !countrycode) {
    return res.status(400).send("Invalid Request!");
  } else {
    const fileUrl =
      "data:" +
      req?.file?.mimetype +
      ";base64," +
      req?.file?.buffer.toString("base64");
    // send the file to the WhatsApp chat
    // console.log(req.file)
    const client = clientSessions[sessionId];
    if (!client) {
      res.status(400).send("Session Expired");
    } else {
      client
        .sendFile(countrycode + phonenumber + "@c.us", fileUrl, req.file.originalname, caption)
        .then((result) => {
          console.log("Result: ", result); //return object success
          res.status(200).send("video Sent to " + phonenumber);
        })
        .catch((erro) => {
          console.error("Error when sending: ", erro); //return object error
          res.status(400).send("video Not Sent");
        });
    }
  }
};

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