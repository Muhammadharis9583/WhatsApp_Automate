const { create, Client , ev} = require("@open-wa/wa-automate");
const express = require("express");
const fs = require('fs')
const app = express();
// or
// import { create, Client } from '@open-wa/wa-automate';

// const launchConfig = {
//   useChrome: true,
//   autoRefresh: true,
//   cacheEnabled: false,
//   sessionId: "hr",
// };

// const phoneNumber = "923154610456@c.us";
// function start(client) {
  
//   client.onMessage(async (message) => {
//     await client.sendText(phoneNumber, "Sunna bhai kessa ha🐐");
//     if (message.body.toLowerCase() === "hi") {
//       await client.sendText(message.from, "Hello 🐐");
//     }
//     else if (message.body.toLowerCase() === "demo") {
//       await client.sendText(message.from, "Demo hi ha abi");
//     }
//   });
// }

// create(launchConfig).then(start);
app.get("/qrcode/:phoneNumber", async (req, res) => {
  const launchConfig = {
    useChrome: true,
    autoRefresh: true,
    cacheEnabled: false,
    sessionId: "hr",
  };
  const phoneNumber = "923154610456@c.us";
function start(client) {
  
  client.onMessage(async (message) => {
    await client.sendText(phoneNumber, "Sunna bhai kessa ha🐐");
    if (message.body.toLowerCase() === "hi") {
      await client.sendText(message.from, "Hello 🐐");
    }
    else if (message.body.toLowerCase() === "demo") {
      await client.sendText(message.from, "Demo hi ha abi");
    }
  });
}
ev.on("qr.**", async (qrcode) => {
  //qrcode is base64 encoded qr code image
  //now you can do whatever you want with it
  const imageBuffer = Buffer.from(
    qrcode.replace("data:image/png;base64,", ""),
    "base64"
  );
  fs.writeFileSync("qr_code.png", imageBuffer);
});
  // get the phone number from the request parameters
  // const phoneNumber = req.params.phoneNumber;

  // // generate a new QR code for the phone number
  // const qrCode = await client.generateQR(phoneNumber, { small: true });

  // // send the QR code as a response to the user
  // res.type("png");
  // qr.toFileStream(res, qrCode);
  create(launchConfig).then(start);
});

app.listen(3000, () => console.log("Server running on port 3000"));

