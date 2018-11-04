module.exports = config => {
    config.set({
        frameworks: ['jasmine'],
        browsers: ['FirefoxHeadless', 'ChromeHeadless'],
        singleRun: true,
        files: ['dist/split.js', 'test/split.spec.js'],
    })
}
