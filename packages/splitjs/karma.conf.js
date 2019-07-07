module.exports = config => {
    config.set({
        customLaunchers: {
            sl_firefox_latest: {
                base: 'SauceLabs',
                browserName: 'firefox',
                platform: 'macOS 10.13',
                version: '63.0',
            },
            sl_chrome_latest: {
                base: 'SauceLabs',
                browserName: 'chrome',
                platform: 'macOS 10.13',
                version: '70.0',
            },
            sl_safari: {
                base: 'SauceLabs',
                browserName: 'safari',
                platform: 'macOS 10.13',
                version: '12.1',
            },

            sl_firefox: {
                base: 'SauceLabs',
                browserName: 'firefox',
                platform: 'Windows 7',
                version: '6.0',
            },
            sl_chrome: {
                base: 'SauceLabs',
                browserName: 'chrome',
                platform: 'Windows 7',
                version: '26.0',
            },

            sl_edge: {
                base: 'SauceLabs',
                browserName: 'MicrosoftEdge',
                platform: 'Windows 10',
                version: '14.14393',
            },
            sl_ie_11: {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                platform: 'Windows 7',
                version: '11.0',
            },
            sl_ie_10: {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                platform: 'Windows 7',
                version: '10.0',
            },
            sl_ie_9: {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                platform: 'Windows 7',
                version: '9.0',
            },
        },
        frameworks: ['jasmine'],
        browsers: ['FirefoxHeadless', 'ChromeHeadless'],
        singleRun: true,
        files: ['dist/split.js', 'test/split.spec.js'],
    })
}
