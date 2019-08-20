# Contributing

## Developing

The tooling is [Yarn](https://yarnpkg.com/), [Lerna](https://lerna.js.org/),
[Prettier](https://prettier.io/) and [Eslint](https://eslint.org/). To get started:

```bash
$ yarn install
$ yarn run lerna link
```

It's easiest to have Prettier format your changes in your editor on save: https://prettier.io/docs/en/editors.html

**Building**

```bash
$ yarn run build
```

**Linting**

```bash
$ yarn run lint
```

## Testing

```bash
$ yarn test
```

Each package has unit tests using Jest. `split.js` uses Jasmine 2.6 for browser testing with IE8 support.
Karma is the test runner for headless browsers. Recent versions of Chrome and Firefox
support headless testing locally. By default, both browsers are tested. If you want to test
with just one or the other, run:

```bash
$ yarn workspace split.js run test --browsers FirefoxHeadless
```

_or_

```bash
$ yarn workspace split.js run test --browsers ChromeHeadless
```

On the CI, [SauceLabs](https://saucelabs.com/) provides cross-platform testing.
Headless Firefox and Chrome are also tested via Docker container.
