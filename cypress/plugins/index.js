/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
const dotenvPlugin = require("cypress-dotenv");

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on("before:browser:launch", (browser = {}, launchOptions) => {
    // args.push('--use-fake-device-for-media-stream')
    if (browser.name === "chrome" || browser.name === "edge") {
      launchOptions.args.push("--use-fake-ui-for-media-stream");
      launchOptions.args.push("--use-fake-device-for-media-stream");
    }

    return launchOptions;
  });

  config = dotenvPlugin(config, {}, true);

  return config;
};
