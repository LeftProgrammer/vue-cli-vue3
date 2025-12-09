import { INDEX_HOMEPAGE_PATH } from "@/store/mutation-types";

export default {
  async init(callback) {
    if (typeof callback === "function") {
      callback();
    }
  },
  getLoginedPath() {
    return INDEX_HOMEPAGE_PATH;
  },
};
