const axios = require("axios");
const qs = require("qs");
const dotenv = require("dotenv");
dotenv.config({ path: "../../config.env" });

exports.paymentProcessing = (req, res) => {
  //Receive Post Request Data from req body
  let reqBody = req.body;

  // Replace these with your actual Client ID and Client Secret
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;

  // Encode credentials to Base64
  const encodedCredentials = Buffer.from(
    `${CLIENT_ID}:${CLIENT_SECRET}`
  ).toString("base64");

  async function getAccessToken() {
    try {
      const response = await axios.post(
        "https://demo-accounts.vivapayments.com/connect/token",
        qs.stringify({ grant_type: "client_credentials" }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${encodedCredentials}`,
          },
        }
      );

      console.log("Access Token:", response.data.access_token);
      res.status(200).json({ "Access Token:": response.data.access_token });
      return response.data.access_token;
    } catch (error) {
      console.error(
        "Error fetching access token:",
        error.response ? error.response.data : error.message
      );
    }
  }

  // Call function to get token
  getAccessToken();
};
