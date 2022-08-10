const { withAxiom } = require("next-axiom");

module.exports = withAxiom({
    headers: {
        "X-Robots-Tag": "noindex, nofollow",
    },
});
