const express = require('express');
const { create, Client ,ev} = require('@open-wa/wa-automate');
const fs = require("fs");
// const qr = require('qr-image');

// create a new Express app
const app = express();

// set up a new wa-automate-nodejs client
app.get('/qrcode/:number',(req,res)=>{
    function start(client) {
      client.onMessage(async (message) => {
        // await client.sendText(phoneNumber, "Sunna bhai kessa ha🐐");
        if (message.body.toLowerCase() === "hi") {
          await client.sendText(message.from, "Hello 🐐");
        } else if (message.body.toLowerCase() === "demo") {
          await client.sendText(message.from, "Demo hi ha abi");
        }
      });
    }
    create({
      sessionId: req.params.number,
      useChrome: true
    }).then((client) => start(client));
    ev.on("qr.**", async (qrcode) => {
      //qrcode is base64 encoded qr code image
      //now you can do whatever you want with it
      const imageBuffer = Buffer.from(
        qrcode.replace("data:image/png;base64,", ""),
        "base64"
      );
      //return res.send(imageBuffer)
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
