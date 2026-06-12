const axios = require("axios");

const sendSMS = async (phone, otp) => {
  try {
    const res = await axios.post(
      "https://control.msg91.com/api/v5/otp",
      {
        mobile: `91${phone}`,
        otp: otp,
      },
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("MSG91 Response:", res.data);

    return res.data;
  } catch (err) {
    console.error("MSG91 Error:", err.response?.data || err.message);
    throw new Error("SMS sending failed");
  }
};

module.exports = sendSMS;