const express = require("express");
const axios = require("axios");

const app = express();

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_USERNAME = process.env.CHANNEL_USERNAME;

app.get("/", (req, res) => {
  res.send("Telegram Channel Verify Bot is running ✅");
});

app.get("/verify", async (req, res) => {
  const userId = req.query.user_id;

  if (!BOT_TOKEN || !CHANNEL_USERNAME) {
    return res.json({
      success: false,
      joined: false,
      message: "BOT_TOKEN or CHANNEL_USERNAME missing"
    });
  }

  if (!userId) {
    return res.json({
      success: false,
      joined: false,
      message: "user_id missing"
    });
  }

  try {
    const response = await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN}/getChatMember`,
      {
        params: {
          chat_id: CHANNEL_USERNAME,
          user_id: userId
        }
      }
    );

    const status = response.data.result.status;
    const joined = ["member", "administrator", "creator"].includes(status);

    res.json({
      success: true,
      joined: joined,
      status: status
    });

  } catch (error) {
    res.json({
      success: false,
      joined: false,
      message: "User bot ko /start kare aur channel join kare"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
