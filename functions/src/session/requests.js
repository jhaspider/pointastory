const functions = require("firebase-functions");

const axios = require("axios");
const url = require("url");
const router = require("express").Router();

const settings = require("../settings.json");

router.post("/verifyToken", async (request, response) => {
  if (request.method !== "POST") {
    response.status(400).send("Only post request allowed for this method");
    return;
  }

  // reCAPTCH token validation
  const token = request.body["token"];
  if (!token) {
    response.status(400).send("Validation Error : Token Missing");
    return;
  }

  axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
  const params = new url.URLSearchParams({ secret: settings.captchSecret, response: token });
  await axios
    .post("https://www.google.com/recaptcha/api/siteverify", params.toString())
    .then((res) => {
      functions.logger.info(res.data);
      response.status(200).send(res.data);
      return;
    })
    .catch((error) => {
      functions.logger.info(error);
      response.status(400).send(error);
      return;
    });

  return;
});

module.exports = router;
