module.exports = function override(config) {
  // Exclude .mjs files in node_modules from source-map-loader
  config.module.rules = config.module.rules.map((rule) => {
    if (rule.loader && rule.loader.includes("source-map-loader")) {
      return {
        ...rule,
        exclude: [/node_modules\/.*\.mjs$/],
      };
    }
    return rule;
  });
  return config;
};