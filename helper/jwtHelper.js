const jwtSettings = require("../constants/jwtSetting");
const JWT = require("jsonwebtoken");

const generateToken = (user) => {
  const expiresIn = "30d";
  const algorithm = "Hs256";

  return JWT.sign(
    {
      iat: Math.floor(Date.now() / 1000),
      ...user,
      algorithm,
    },
    jwtSettings.SECRET,
    {
      expiresIn,
    }
  );
};

const passportVerifyAccount = (id) => {
  const expiresIn = "30d";
  return JWT.sign({ id }, jwtSettings.SECRET, { expiresIn });
};

module.exports = {
  generateToken,
  passportVerifyAccount,
};
