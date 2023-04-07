const express = require('express');
const { create, Client ,ev} = require('@open-wa/wa-automate');
const fs = require("fs");
// const qr = require('qr-image');

// create a new Express app
const app = express();

// set up a new wa-automate-nodejs client
clientSessions = {};
app.get('/qrcode/:number',(req,res)=>{
    function start(client) {
      // console.log("Client is ready!");
      // client.getAllChats().then((chats) => {
      //   console.log("Total chats: ", chats.length);
      // });
      const message = "HELLO WORLD"
      const to = "923335662534@c.us"
      client.sendText(to, message).then((result) => {
        console.log("Result: ", result); //return object success
      }).catch((erro) => {
        console.error("Error when sending: ", erro); //return object error
      });
      // client.onMessage(async (message) => {
      //   // await client.sendText(phoneNumber, "Sunna bhai kessa ha🐐");
      //   if (message.body.toLowerCase() === "hi") {
      //     await client.sendText(message.from, "Hello 🐐");
      //   } else if (message.body.toLowerCase() === "demo") {
      //     await client.sendText(message.from, "Demo hi ha abi");
      //   }
      // });
    }
    create({
      sessionId: req.params.number,
      
    }).then((client) => {
      clientSessions[req.params.number] = client;
      // start(client);
    });

    //if session exists then send 'ok' to client
    ev.on("session.data", async (session) => {
      // console.log("session.data", session);
      res.send("ok");
    });

    ev.on("qr.**", async (qrcode) => {
      // console.log("QR RECEIVED", qrcode);
      const imageBuffer = Buffer.from(
        qrcode.replace("data:image/png;base64,", ""),
        "base64"
      );
      fs.writeFileSync("qr.png", imageBuffer);
      res.sendFile(__dirname + "/qr.png");
    });

  // return res.send(imageBuffer)
})

app.get('/test', async (req, res) => {
  // send sessions object
  res.send(clientSessions);
})

app.post('/send/:session/:message/:to', async (req, res) => {
  const client = clientSessions[req.params.session]
  const message = req.params.message
  const to = req.params.to + "@c.us"
  client.sendText(to, message).then((result) => {
    console.log("Result: ", result); //return object success
    res.send("Message Sent")
  }).catch((erro) => {
    console.error("Error when sending: ", erro); //return object error
    res.send("Message Not Sent")
  });
})

app.post('/sendmssg/:session', async (req, res) => {
  const client = clientSessions[req.params.session]
  console.log(client)
  const message = "HELLO WORLD"
  const to = "923335662534@c.us"
  client.sendText(to, message).then((result) => {
    console.log("Result: ", result); //return object success
    res.send("Message Sent")
  }).catch((erro) => {
    console.error("Error when sending: ", erro); //return object error
    res.send("Message Not Sent")
  });
})

// set up an Express route to generate a QR code
// app.get('/qrcode/:phoneNumber', async (req, res) => {
//   // get the phone number from the request parameters
//   const phoneNumber = req.params.phoneNumber;

//   // generate a new QR code for the phone number
//   const qrCode = await client.then((client)=>client.getQ)

//   // send the QR code as a response to the user
//   res.type('png');
//   qr.image(qrCode, { type: 'png' }).pipe(res);
// });

// start the wa-automate-nodejs client

// start the Express app
app.listen(3000, () => console.log('Server running on port 3000'));
