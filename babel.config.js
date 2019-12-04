const presets = [
  "minify",
  [
    "@babel/env",
    {
      targets: {
        ie: "11",
      },
    },
  ],
];

module.exports = { presets };
