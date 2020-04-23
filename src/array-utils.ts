export type ArrDiffCreate<T> = {
  type: "create";
  idx: number;
  item: T;
};

export type ArrDiffUpdate<T> = {
  type: "update";
  idx: number;
  item: T;
};

export type ArrDiffDelete = {
  type: "delete";
  idx: number;
};

export type ArrDiff<T> = ArrDiffCreate<T> | ArrDiffUpdate<T> | ArrDiffDelete;
export type ArrDiffs<T> = Array<ArrDiff<T>>;
export type ArrDiffCompare<T> = (a: T, b: T) => boolean;

export function arrayDiffs<T>(prev: T[], next: T[]): ArrDiffs<T> {
  const diffs: ArrDiffs<T> = [];
  let i: number;

  for (i = 0; i < next.length; i++) {
    const nextItem = next[i];

    if (!(i in prev)) {
      diffs.push({type: "create", idx: i, item: nextItem});
    } else if (!isEquivalent(prev[i], nextItem)) {
      diffs.push({type: "update", idx: i, item: nextItem});
    }
  }

  if (!prev) return diffs.reverse();
  return diffs.concat(prev.slice(i).map((_, j) => ({type: "delete", idx: i + j}))).reverse();
}

export function isEquivalent<T>(a?: T | null, b?: T | null): boolean {
  if (a === null || a === undefined) return b === null || b === undefined;
  if (b === null || b === undefined) return a === null || a === undefined;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object") return a === b;

  if (Array.isArray(a) && Array.isArray(b)) {
    for (const va of a) if (!b.some(vb => isEquivalent(va, vb))) return false;
    for (const vb of b) if (!a.some(va => isEquivalent(va, vb))) return false;
  } else {
    for (const ka in a) if (!isEquivalent(a[ka], b[ka])) return false;
    for (const kb in b) if (!isEquivalent(a[kb], b[kb])) return false;
  }

  return true;
}
