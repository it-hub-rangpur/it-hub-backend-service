import envConfig from "../../configs/envConfig";
const TwoCaptcha = require("@2captcha/captcha-solver");

const { Configuration, NopeCHAApi } = require("nopecha");

const configuration = new Configuration({
  apiKey: "YOUR_API_KEY",
});
const nopecha = new NopeCHAApi(configuration);

const getReCaptchaToken = async () => {
  const solver = new TwoCaptcha.Solver(envConfig.recaptchaKey);

  const captchaResponse = await solver.recaptcha({
    pageurl: envConfig.websiteURL,
    googlekey: envConfig.websiteKey,
  });
  return captchaResponse.data;
};

const getReCaptchaTokenByNope = async () => {
  const token = await nopecha.solveToken({
    type: "recaptcha2",
    sitekey: envConfig.websiteKey,
    url: envConfig?.websiteURL,
  });

  console.log(token);
  return token;
};

export const reCaptchaService = {
  getReCaptchaToken,
  getReCaptchaTokenByNope,
};
