const express = require('express');
const { create, Client ,ev} = require('@open-wa/wa-automate');
const fs = require("fs");
var fileupload = require("express-fileupload");
const bodyParser = require('body-parser');
const multer  = require('multer')
const upload = multer({});

// const qr = require('qr-image');

// create a new Express app
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
// app.use(fileupload());

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

app.post('/sendImg', upload.single('image'),async (req, res) => {
  const {caption, phonenumber, sessionId} = req.body;
  // console.log(req.body)
  // var caption="test"
  // var phonenumber="923335662534@c.us"
  // var sessionId="03115843266"
  const imgUrl = "data:"+req.file.mimetype+";base64,"+req.file.buffer.toString('base64');
  // //const imgUrl = "https://fastly.picsum.photos/id/791/536/354.jpg?hmac=eXUPs7QLTn9HF78YkhAz85vtEsUXj2aePprZoTCwCdU";

  // if image is not present in the request, return an error
  if (!req.file) {
    return res.status(400).send('No image in the request');
  } else {
    // send the image to the WhatsApp chat
    const client = clientSessions[sessionId]
    client.sendImage(phonenumber+"@c.us", imgUrl, "testfile" + "@c.us", caption).then((result) => {
      console.log("Result: ", result); //return object success
      res.send("Image Sent")
    }).catch((erro) => {
      console.error("Error when sending: ", erro); //return object error
      res.send("Image Not Sent")
    });
  }
})

app.post('/bulksend', async (req, res) => {
  // phonenumbers => array of phone numbers
  const {message, phonenumbers, sessionId} = req.body;
  const client = clientSessions[sessionId]

  await Promise.all(phonenumbers.map(async (number) => {
    await client.sendText(number+"@c.us", message).then((result) => {
      console.log("Result: ", result); //return object success
    }).catch((erro) => {
      console.error("Error when sending: ", erro); //return object error
    });
  })).then((vals) => {
    res.send("Messages Sent")
    console.log(vals)
  }).catch(() => {
    res.send("Messages Not Sent")
  })

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

// start the Express app
app.listen(3002, () => console.log('Server running on port 3000'));
