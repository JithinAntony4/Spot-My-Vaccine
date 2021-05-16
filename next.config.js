const isProd = process.env.NODE_ENV === "production";

const withPWA = require("next-pwa")


module.exports = withPWA({
    future: {webpack5: true},
    pageExtensions: ["tsx"],
    pwa: {
        disable: !isProd,
        dest: "public"
    }
})
