// Step 2 of the OAuth handshake: GitHub redirects here with a `code`.
// Exchange it server-side for an access token (this is the part that needs
// the client secret and can't happen in the browser), then hand the token
// back to the Decap CMS admin tab via postMessage.
module.exports = async (req, res) => {
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;
  const code = req.query.code;

  if (!clientId || !clientSecret) {
    res.status(500).send("Missing OAUTH_CLIENT_ID or OAUTH_CLIENT_SECRET environment variable.");
    return;
  }
  if (!code) {
    res.status(400).send("Missing ?code from GitHub.");
    return;
  }

  try {
    const tokenResp = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const tokenData = await tokenResp.json();

    if (tokenData.error) {
      res.status(401).send(renderHandshakePage("error", { message: tokenData.error_description || tokenData.error }));
      return;
    }

    res.status(200).send(
      renderHandshakePage("success", { token: tokenData.access_token, provider: "github" })
    );
  } catch (err) {
    res.status(500).send(renderHandshakePage("error", { message: err.message }));
  }
};

// Decap CMS's popup-based OAuth protocol: the opener (admin tab) polls this
// popup with "authorizing:github" until it replies with a message of the
// form "authorization:github:success:<json>" or "...:error:<json>".
function renderHandshakePage(type, data) {
  const payload = JSON.stringify(`authorization:github:${type}:${JSON.stringify(data)}`);
  return `<!DOCTYPE html>
<html>
<body>
<script>
(function () {
  function receiveMessage(e) {
    window.opener.postMessage(${payload}, e.origin);
  }
  window.addEventListener("message", receiveMessage, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script>
</body>
</html>`;
}
