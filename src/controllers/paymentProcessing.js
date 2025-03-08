const axios = require("axios");
const qs = require("qs");
const dotenv = require("dotenv");
dotenv.config({ path: "../../config.env" });

exports.paymentProcessing = (req, res) => {
  //Receive Post Request Data from req body
  let reqBody = req.body;

  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;

  async function getAccessToken() {
    try {
      const response = await axios.post(
        "https://accounts.vivapayments.com/connect/token",
        qs.stringify({ grant_type: "client_credentials" }),
        {
          auth: {
            username: CLIENT_ID,
            password: CLIENT_SECRET,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("Access Token:", response.data.access_token);
      return response.data.access_token;
    } catch (error) {
      console.error(
        "Error fetching access token:",
        error.response ? error.response.data : error.message
      );
    }
  }

  getAccessToken();
};
