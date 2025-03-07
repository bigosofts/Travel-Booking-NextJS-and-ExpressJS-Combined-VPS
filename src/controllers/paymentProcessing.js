const axios = require("axios");

exports.paymentProcessing = (req, res) => {
  //Receive Post Request Data from req body
  let reqBody = req.body;

  async function getAccessToken() {
    const clientId =
      "9rkednnbrzx67o6r6ss7px5corae0wcw488b094pwe0k1.apps.vivapayments.com";
    const clientSecret = "74O0ye2jzkmrEP291XUai5WHJ168qY";
    const url = "https://demo-accounts.vivapayments.com/connect/token"; // Use live URL in production

    try {
      const response = await axios.post(
        url,
        new URLSearchParams({
          grant_type: "client_credentials",
          client_id: clientId,
          client_secret: clientSecret,
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error(
        "Error fetching access token:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  // Test the function
  getAccessToken().then((token) => {
    res.status(200).json({ "Access Token:": token });
  });
};
