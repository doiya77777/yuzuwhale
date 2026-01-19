# Development Workflow

We use a feature-branch workflow with Vercel Preview Deployments. **Do not push directly to `main`.**

## Prerequisites

- [GitHub CLI (gh)](https://cli.github.com/)
- [Vercel CLI](https://vercel.com/docs/cli)

## Step-by-Step Guide

### 1. Start a New Feature

Create a new branch for your task (feature, bugfix, or chore):

```bash
git checkout -b feature/your-feature-name
```

### 2. Develop & Commit

Make changes and commit as usual:

```bash
git add .
git commit -m "feat: add amazing new feature"
```

### 3. Create a Pull Request (PR)

Push your branch and create a PR on GitHub in one command:

```bash
gh pr create --web
```

*   `--web`: Opens the browser to fill in title/description (Recommended).
*   Alternatively, just run `gh pr create` to do it in the terminal.

### 4. Vercel Preview

Once the PR is created, Vercel will automatically build a **Preview Deployment**.
You can see the bot's comment in the PR timeline with a live URL (e.g., `https://yuzuwhale-git-feature-xxx.vercel.app`).

### 5. Merge

When you are happy with the preview:

```bash
gh pr merge --squash --delete-branch
```

*   `--squash`: Combines all commits into one clean commit on main.
*   `--delete-branch`: Deletes the local and remote feature branch after merge.

## Vercel Local Dev

To run the full Vercel environment locally (including Serverless Functions):

```bash
vercel dev
```
