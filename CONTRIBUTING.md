# Contributing

## Report a bug or propose a new feature

Open a new issue from [issues](https://github.com/ueokande/vimmatic/issues).
**Ensure the issue was not already reported** by searching on GitHub under Issues.
The issue should include a title and clear description.

Pull request is also welcome to send a patch from [Pull Requests](https://github.com/ueokande/vimmatic/pulls).
Ensure the pull request includes description, and passes tests in CI.

## Start a development

Clone sources into local

    git clone https://github.com/ueokande/vimmatic

Install dependencies:

    pnpm install

Start webpack:

    pnpm start

Then open `about:debugging` in Firefox, and choose directory from "Load Temporary Add-on".
To run tests and lint:

    pnpm test
    pnpm lint
