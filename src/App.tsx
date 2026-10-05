import { useMemo, useState } from "react";

type DiffLine = { type: "same" | "added" | "removed"; value: string };

function diffLines(a: string[], b: string[]): DiffLine[] {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(m + 1).fill(0),
  );
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] =
        a[i] === b[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      result.push({ type: "same", value: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      result.push({ type: "removed", value: a[i] });
      i++;
    } else {
      result.push({ type: "added", value: b[j] });
      j++;
    }
  }
  while (i < n) {
    result.push({ type: "removed", value: a[i] });
    i++;
  }
  while (j < m) {
    result.push({ type: "added", value: b[j] });
    j++;
  }
  return result;
}

const DEFAULT_BEFORE = "Buy milk\nWalk the dog\nFinish report\nCall mom";
const DEFAULT_AFTER = "Walk the dog\nFinish report\nBook flight\nCall mom";

function lineColor(type: DiffLine["type"]) {
  if (type === "added") return { bg: "#c9f3b6", text: "#0F766E", prefix: "+ " };
  if (type === "removed") return { bg: "#fdc8c8", text: "#B45309", prefix: "- " };
  return { bg: "transparent", text: "#425856", prefix: "  " };
}

const App = () => {
  const [before, setBefore] = useState(DEFAULT_BEFORE);
  const [after, setAfter] = useState(DEFAULT_AFTER);

  const diff = useMemo(() => {
    const a = before.split("\n").filter((l) => l.length > 0);
    const b = after.split("\n").filter((l) => l.length > 0);
    return diffLines(a, b);
  }, [before, after]);

  const added = diff.filter((d) => d.type === "added").length;
  const removed = diff.filter((d) => d.type === "removed").length;

  return (
    <div
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
      className="min-h-screen bg-[#fdfdfd] bg-gradient-to-b from-[#5becd9]/50 to-[#15463f]/50 text-[#0F1E1C] p-6"
    >
      <div className="max-w-4xl mx-auto ">
        <header className="mb-6 borderborder-zinc-700 rounded-[10px] p-2 px-4">
          <p className="text-xl text-center tracking-wide text-zinc-800 font-bold mb-1">
            LCS Diff algorithm (Longest Common Subsequence)
          </p>
          <h1 className="text-xl font-bold mt-[30px] mb-1 font-samim">
            What changed?
          </h1>
          <p className="text-sm font-samim flex flex-col text-[#425856] leading-6">
            <span>
              Use the same algorithm behind `git diff` and React’s list change
              detection.
            </span>
            <span>
              Edit each of the two lists below and see exactly which line was
              removed and which line was added.
            </span>
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="bg-white rounded-lg border border-[#eee9e9] p-4">
            <h2 className="text-xs font-semibold mb-2">Before</h2>
            <textarea
              value={before}
              onChange={(e) => setBefore(e.target.value)}
              dir="ltr"
              rows={6}
              className="w-full border border-[#D8E2E0] rounded px-3 py-2 text-xs font-mono resize-none"
            />
          </div>
          <div className="bg-white rounded-lg border border-[#E1E8E6] p-4">
            <h2 className="text-xs font-semibold mb-2">After</h2>
            <textarea
              value={after}
              onChange={(e) => setAfter(e.target.value)}
              dir="ltr"
              rows={6}
              className="w-full border border-[#D8E2E0] rounded px-3 py-2 text-xs font-mono resize-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg font-samim border border-[#E1E8E6] p-5 mb-5">
          <h2 className="text-sm font-semibold mb-3">
            The diff result
            <span className="text-xs mx-2 font-normal text-[#425856]">
              ({added} added, {removed} removed)
            </span>
          </h2>
          <div dir="ltr" className="font-mono text-sm">
            {diff.map((line, idx) => {
              const c = lineColor(line.type);
              return (
                <div
                  key={idx}
                  style={{ backgroundColor: c.bg, color: c.text }}
                  className="px-3 py-1 rounded"
                >
                  {c.prefix}
                  {line.value}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#E1E8E6] p-5 mb-5">
          <h2 className="text-md font-bold mb-2 font-samim">
            Why does this matter for React as well?
          </h2>
          <p className="text-sm text-[#425856] leading-6 font-samim">
            When you render a list in JSX using `.map()` and, for example,
            remove an item from the middle of the list, React needs to determine
            which item was actually removed and which items are still the same.
            The `key` helps React identify the identity of each item across
            different renders. If the `key` is a stable and unique value, such
            as the item's actual `id`, React can understand that “this is the
            same item as before, its position just changed” or that “this item
            was removed.” However, if you use the array `index` as the `key`,
            adding or removing items in the middle of the list changes the
            indexes. React may then associate an item with the wrong identity,
            which can cause state and DOM associated with one item to be reused
            for another item.
          </p>
        </div>
        <div className="bg-white rounded-lg border border-[#E1E8E6] p-5">
          <h2 className="text-md font-bold mb-2 font-samim">
            The difference between "Myer algorithm" and "LCS algorithm"
          </h2>
          <p className="text-sm text-[#425856] leading-6 font-samim">
            The LCS (Longest Common Subsequence) algorithm focuses on finding
            the longest sequence of elements that appears in both lists while
            preserving their relative order. It can then use that common
            subsequence to determine which items were added or removed. The
            Myers algorithm, on the other hand, is specifically designed to find
            a minimal edit script between two sequences, the smallest number of
            insertions and deletions needed to transform one sequence into the
            other. In practice, Myers is often more efficient for diff tools
            such as `git diff`, while LCS is more of a general algorithmic
            foundation for comparing sequences. In short: LCS finds what the two
            sequences have in common; Myers finds the most efficient way to
            transform one sequence into the other.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
