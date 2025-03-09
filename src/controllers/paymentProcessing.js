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

      return response.data.access_token;
    } catch (error) {
      console.error(
        "Error fetching access token:",
        error.response ? error.response.data : error.message
      );
    }
  }

  async function createPaymentOrder() {
    const accessToken = await getAccessToken();
    const url = "https://api.vivapayments.com/checkout/v2/orders"; // Use live URL in production

    const payload = {
      amount: reqBody.amount, // Amount in cents (e.g., 10.00 EUR)
      customerTrns: reqBody.customerTrns,

      customer: {
        email: reqBody.customeEmail,
        fullName: reqBody.customerName,
        phone: reqBody.customerPhone,
      },
      paymentTimeout: 300,
      preauth: false,
      allowRecurring: false,
      maxInstallments: 12,
      paymentNotification: true,
      disableExactAmount: false,
      disableCash: true,
      disableWallet: true,
      sourceCode: reqBody.sourceCode,
      merchantTrns: reqBody.merchantTrns,
      tags: reqBody.tags,
    };

    try {
      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      console.error(
        "Error creating payment order:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  // Test the function
  createPaymentOrder().then((order) => {
    res.status(200).json({
      status: "Success",
      checkoutURL: `https://www.vivapayments.com/web/checkout?ref=${order.orderCode}&color=008F79`,
      orderCode: order.orderCode,
    });
  });
};

exports.checkTransactions = (req, res) => {
  let reqBody = req.body;
  console.log(reqBody);

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

      return response.data.access_token;
    } catch (error) {
      console.error(
        "Error fetching access token:",
        error.response ? error.response.data : error.message
      );
    }
  }

  async function verifyTransaction(transactionId) {
    const accessToken = await getAccessToken();

    try {
      const response = await axios.get(
        `https://api.vivapayments.com/checkout/v2/transactions/${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.statusId === "F") {
        res.status(200).json({
          status: "Success",
          data: response.data,
        });
      } else {
        res.status(200).json({
          status: "Failed",
          data: response.data,
        });
      }
    } catch (error) {
      res.status(200).json({
        status: "Failed",
        data: error,
      });
    }
  }

  verifyTransaction(reqBody.transactionId);
};
