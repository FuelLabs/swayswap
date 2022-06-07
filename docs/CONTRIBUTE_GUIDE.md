# 💚 Contributing To SwaySwap

Thanks for your interest in contributing to SwaySwap! This document outlines the process for installing dependencies and setting up SwaySwap for development, as well as some conventions on contributing to SwaySwap.

If you run into any difficulties getting started, you can always ask questions on our [Discord](https://discord.gg/xfpK4Pe).

## Finding Something to Work On

There are many ways in which you may contribute to the SwaySwap project, some of which involve coding knowledge and some which do not. A few examples include:

- Reporting bugs
- Adding new features or bugfixes for which there is already an open issue
- Making feature requests

Check out our [Help Wanted](https://github.com/FuelLabs/swayswap/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) or [Good First Issues](https://github.com/FuelLabs/swayswap/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) to find a suitable task.

If you are planning something big, for example, related to multiple components or changes current behaviors, make sure to [open an issue](https://github.com/FuelLabs/swayswap/issues/new) to discuss with us before starting on the implementation.

## Contribution Flow

This is a rough outline of what a contributor's workflow looks like:

- Make sure what you want to contribute is already tracked as an issue.
  - We may discuss the problem and solution in the issue.
- Create a Git branch from where you want to base your work. This is usually master.
- Write code, add test cases where applicable, and commit your work.
- Run tests and make sure all tests pass.
- If the PR contains any breaking changes, add the `breaking` label to your PR.
- Push your changes to a branch in your fork of the repository and submit a pull request.
  - Use one of the following tags in the title of your PR:
    - `feat:` - A new feature
    - `fix:` - A bug fix
    - `docs:` - Documentation only changes
    - `style:` - Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
    - `refactor:` - A code change that neither fixes a bug nor adds a feature
    - `perf:` - A code change that improves performance
    - `test:` - Adding missing tests or correcting existing tests
    - `build:` - Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
    - `ci:` - Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
    - `chore:` - Other changes that don't modify src or test files
    - `revert:` - Reverts a previous commit
  - Make sure to mention the issue, which is created at step 1, in the commit message.
- Your PR will be reviewed and some changes may be requested.
  - Once you've made changes, your PR must be re-reviewed and approved.
  - If the PR becomes out of date, you can use GitHub's 'update branch' button.
  - If there are conflicts, you can merge and resolve them locally. Then push to your PR branch.
    Any changes to the branch will require a re-review.
- Our CI system (Github Actions) automatically tests all authorized pull requests.
- Use Github to merge the PR once approved.

Thanks for your contributions!

### Linking Issues

Pull requests should be linked to at least one issue in the same repo.

If the pull request resolves the relevant issues, and you want GitHub to close these issues automatically after it merged into the default branch, you can use the syntax (`KEYWORD #ISSUE-NUMBER`) like this:

```
close #123
```

If the pull request links an issue but does not close it, you can use the keyword `ref` like this:

```
ref #456
```

Multiple issues should use full syntax for each issue and separate by a comma, like:

```
close #123, ref #456
```
