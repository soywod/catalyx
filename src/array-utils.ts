type ArrDiffCreate<T> = {
  type: "create";
  idx: number;
  item: T;
};

type ArrDiffUpdate<T> = {
  type: "update";
  idx: number;
  item: T;
};

type ArrDiffDelete = {
  type: "delete";
  idx: number;
};

export type ArrDiff<T> = ArrDiffCreate<T> | ArrDiffUpdate<T> | ArrDiffDelete;
export type ArrDiffs<T> = Array<ArrDiff<T>>;
export type ArrDiffCompare<T> = (a: T, b: T) => boolean;

export function arrayDiffs<T>(prev: T[], next: T[], compare?: ArrDiffCompare<T>): ArrDiffs<T> {
  const isEqual = compare || ((a: T, b: T) => a === b);
  const diffs: ArrDiffs<T> = [];
  let i: number;

  for (i = 0; i < next.length; i++) {
    const nextItem = next[i];

    if (!(i in prev)) {
      diffs.push({type: "create", idx: i, item: nextItem});
    } else if (!isEqual(prev[i], nextItem)) {
      diffs.push({type: "update", idx: i, item: nextItem});
    }
  }

  if (!prev) return diffs.reverse();
  return diffs.concat(prev.slice(i).map((_, j) => ({type: "delete", idx: i + j}))).reverse();
}
