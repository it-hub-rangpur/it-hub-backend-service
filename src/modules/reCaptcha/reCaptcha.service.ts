import envConfig from "../../configs/envConfig";
const TwoCaptcha = require("@2captcha/captcha-solver");
const ac = require("@antiadmin/anticaptchaofficial");

ac.setAPIKey(envConfig?.antiCaptchaKey);

const { Configuration, NopeCHAApi } = require("nopecha");

const configuration = new Configuration({
  apiKey: envConfig.nopeCaptchaKey,
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
  return token;
};

const getReCaptchaTokenByAnti = async () => {
  const gresponse = await ac.solveRecaptchaV2Proxyless(
    envConfig?.websiteURL,
    envConfig.websiteKey,
    true
  );
  return gresponse;
};

export const reCaptchaService = {
  getReCaptchaToken,
  getReCaptchaTokenByNope,
  getReCaptchaTokenByAnti,
};
