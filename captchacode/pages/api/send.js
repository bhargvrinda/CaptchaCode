import {withIronSessionApiRoute} from "iron-session/next";
import {newCaptchaImages} from "./captcha-image";

export default withIronSessionApiRoute(async function handler(req,res) {
  const {message,selectedIndexes} = req.body;
  const captchaImages = req.session.captchaImages || [];

  const dogsIndexes = captchaImages
    .map((path, index) => {
      return path.includes('/dogs-and-muffins/dog') ? index : -1;
    })
    .filter(index => index !== -1);


    const sortedDogs = [...dogsIndexes].sort((a, b) => a - b);
    const sortedSelected = [...selectedIndexes].sort((a, b) => a - b);
    
    const captchaIsOk = JSON.stringify(sortedDogs) === JSON.stringify(sortedSelected);


  // reset captcha images
  req.session.captchaImages = newCaptchaImages();
  await req.session.save();


  // send
  const sent = captchaIsOk;
  // send for real

  res.json({
    captchaIsOk,
    sent,
  });
}, {
  cookieName: 'session',
  password: process.env.SESSION_SECRET,
});