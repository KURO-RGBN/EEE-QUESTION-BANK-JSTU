
export default async function handler(req, res) {
  const { code } = req.query;
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });
  const data = await tokenRes.json();

  if (data.error) {
    res.status(400).send(`Error: ${data.error_description}`);
    return;
  }

  const token = data.access_token;
  const script = `
    <script>
      const receiveMessage = (message) => {
        window.opener.postMessage(
          'authorization:github:success:${JSON.stringify({ token }).replace(/'/g, "\\'")}',
          message.origin
        );
        window.removeEventListener("message", receiveMessage, false);
      };
      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:github", "*");
    </script>
  `;
  res.setHeader("Content-Type", "text/html");
  res.send(script);
}
