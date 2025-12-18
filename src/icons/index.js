import SvgIcon from "@/components/SvgIcon";

const req = require.context("./svg", false, /\.svg$/);
req.keys().forEach(req);

export default function setupSvgIcon(app) {
  app.component("SvgIcon", SvgIcon);
}
