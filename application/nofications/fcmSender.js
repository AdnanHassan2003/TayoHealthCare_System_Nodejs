const axios = require('axios');
const { getAccessToken } = require('../../config/firebase');

async function sendCallNotification({ token, message, projectId, payload }) {
  try {
    const accessToken = await getAccessToken();
    const url = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;

    // Default payload if none is provided
    const defaultPayload = {
      message: {
        token,
        notification: {
          title: "Tayo Heath care Service",
          body: `${message} is calling you`
        },
        android: {
          priority: "high",
          notification: {
            click_action: "FLUTTER_NOTIFICATION_CLICK",
            channel_id: "call_channel"
          }
        },
        data: {
          type: "call_invitation",
          message
        }
      }
    };

    const finalPayload = payload || defaultPayload;

    const response = await axios.post(url, finalPayload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    });

    console.log("✅ Notification sent:", response.status, response.data);
  } catch (err) {
    console.error("❌ Failed to send notification:", err.message);
  }
}

module.exports = { sendCallNotification };
