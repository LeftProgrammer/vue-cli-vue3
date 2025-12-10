module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    // Vue3 推荐规则 + 基础 JS 规则 + Prettier 集成
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
  rules: {
    // 生产环境收敛日志，开发环境完全放开
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",

    // 规则适当放宽
    quotes: "off", // 允许单双引号混用
    "no-unused-vars": [
      "warn",
      {
        args: "none", // 允许未使用的函数参数（很多生命周期/回调会这样）
        ignoreRestSiblings: true,
      },
    ],
    "no-undef": "warn",

    // Vue 相关规则
    "vue/multi-word-component-names": "off", // 允许单词组件名（如 Home、Navbar）
    "vue/no-mutating-props": "warn",
    "vue/no-v-html": "off",
    "vue/attribute-hyphenation": "off", // 允许 :isRoot 这类属性名
    "vue/no-deprecated-router-link-tag-prop": "off", // 允许暂时使用 router-link 的 tag 属性

    // 允许在 script/setup 等场景下未使用的组件名/变量
    "vue/no-unused-components": "warn",
    "vue/no-unused-vars": "warn",

    // 使用 prettier，但只给出 warning，并指定 endOfLine:auto 兼容不同系统换行符
    "prettier/prettier": [
      "warn",
      {
        endOfLine: "auto",
      },
    ],
  },
};
