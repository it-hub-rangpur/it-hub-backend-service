import envConfig from "../../configs/envConfig";
const TwoCaptcha = require("@2captcha/captcha-solver");

const getReCaptchaToken = async () => {
  const solver = new TwoCaptcha.Solver(envConfig.recaptchaKey);

  const captchaResponse = await solver.recaptcha({
    pageurl: envConfig.websiteURL,
    googlekey: envConfig.websiteKey,
  });

  return captchaResponse.data;
};

export const reCaptchaService = {
  getReCaptchaToken,
};
