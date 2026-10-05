# Diff Algorithm Demo

An interactive React + TypeScript demo of the Longest Common Subsequence (LCS) algorithm — the same core idea behind `git diff` and the list-reconciliation logic React uses when rendering `.map()` output.

LiveDemo : https://diff-algorithm.vercel.app/

## Why this project

I wanted to actually understand how tools I use every day — Git, React — decide what changed between two versions of something, instead of just trusting that they get it right. The naive approach (comparing items by position) breaks the moment something is inserted or removed from the middle of a list; LCS is the fix, and it's simple enough to implement from scratch and see exactly how it works.

## What it does

- Two editable text areas (`before` / `after`), one item per line
- A live diff view showing which lines are unchanged, removed, or added — computed with a from-scratch LCS implementation, not a library
- A short explanation connecting the algorithm directly to why React needs a stable, real `key` (not array index) to correctly reconcile list items instead of treating a shifted item as an entirely new one

## Tech stack

- React (hooks only: `useState`, `useMemo`)
- TypeScript
- Tailwind CSS
- No diff libraries — the LCS algorithm is implemented from scratch

## How it works

```ts
function diffLines(a: string[], b: string[]): DiffLine[] {
  const n = a.length, m = b.length;
  // dp[i][j] = length of the LCS between a[i..] and b[j..]
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i+1][j+1] + 1 : Math.max(dp[i+1][j], dp[i][j+1]);
    }
  }
  // walk the table to reconstruct same / removed / added lines
  ...
}
```

The DP table stores, for every pair of remaining suffixes, how long their longest common subsequence is. Walking it from the start produces the actual sequence of "same / removed / added" operations — this is a simplified version of what `git diff` runs internally (real Git uses the more optimized Myers diff algorithm, built on the same underlying idea).

## Running locally

```bash
npm install
npm run dev
```

## What I'd improve next

- Implement the actual Myers diff algorithm and compare its output/performance against this simpler LCS version
- Add word-level (not just line-level) diffing, like what GitHub shows for a single changed line
- Visualize the DP table itself, the way the Levenshtein demo in this series does
