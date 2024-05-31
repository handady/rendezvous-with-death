const {
  override,
  addWebpackAlias,
  setWebpackPublicPath,
} = require("customize-cra");
const path = require("path");

module.exports = override(
  addWebpackAlias({
    "@assets": path.resolve(__dirname, "frontend/src/assets"),
  }),
);
