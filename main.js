require("dotenv").config();
const fs = require("fs");
const CryptoJS = require("crypto-js");
const axios = require("axios");

const {
  walletsPath,
  token,
  chain,
  minAmount,
  maxAmount,
  minPause,
  maxPause,
} = require("./config");

const fileData = fs.readFileSync(walletsPath, "utf8");
const wallets = fileData.split("\n");

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

async function withdrawRandom(apiKey, apiSecret, coin, network, wallets) {
  try {
    for (const address of wallets) {
      if (address == "") throw new Error("Add wallets to txt file");
      const amount = Math.floor(
        Math.random() * (maxAmount - minAmount + 1) + minAmount
      );
      const timestamp = Date.now();
      const queryString = `coin=${coin}&address=${address}&amount=${amount}&network=${network}&timestamp=${timestamp}`;

      const signature = CryptoJS.HmacSHA256(queryString, apiSecret).toString(
        CryptoJS.enc.Hex
      );

      const url = `https://api.mexc.com/api/v3/capital/withdraw/apply?${queryString}&signature=${signature}`;

      const resp = await axios.post(
        url,
        {},
        {
          headers: {
            "X-MEXC-APIKEY": apiKey,
          },
        }
      );
      console.log(`Withdraw to address ${address} with amount ${amount}`);
      console.log("Response Data:", resp.data);

      const pauseDuration = Math.random() * (maxPause - minPause) + minPause;
      await new Promise((resolve) => setTimeout(resolve, pauseDuration));
    }
  } catch (error) {
    console.error("Error", error.data);
  }
}

withdrawRandom(apiKey, apiSecret, token, chain, wallets);
