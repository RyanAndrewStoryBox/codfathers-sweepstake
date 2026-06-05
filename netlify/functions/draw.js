const Pusher = require("pusher");

exports.handler = async function(event, context) {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Simple host password check
  const { action, data, password } = JSON.parse(event.body || "{}");
  if (password !== process.env.HOST_PASSWORD) {
    return { statusCode: 403, body: JSON.stringify({ error: "Wrong password" }) };
  }

  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
  });

  // Trigger event on the sweepstake channel
  await pusher.trigger("sweepstake", action, data);

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true }),
  };
};
