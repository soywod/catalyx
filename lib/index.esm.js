import { BehaviorSubject, defer } from 'rxjs';
import { withLatestFrom, flatMap, mergeAll } from 'rxjs/operators';
import isEqual from 'lodash/fp/isEqual';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function arrayDiffs(prev, next, compare) {
    var isEqual = compare || (function (a, b) { return a === b; });
    var diffs = [];
    var i;
    for (i = 0; i < next.length; i++) {
        var nextItem = next[i];
        if (!(i in prev)) {
            diffs.push({ type: "create", idx: i, item: nextItem });
        }
        else if (!isEqual(prev[i], nextItem)) {
            diffs.push({ type: "update", idx: i, item: nextItem });
        }
    }
    if (!prev)
        return diffs.reverse();
    return diffs.concat(prev.slice(i).map(function (_, j) { return ({ type: "delete", idx: i + j }); })).reverse();
}

function trexFactory(e) {
    var elems = Array.isArray(e) ? e : e ? [e] : [];
    var elem = 0 in elems ? elems[0] : null;
    var bindings = {
        bind: function (obs$, render) {
            elems.forEach(function (elem) {
                obs$.subscribe(function (val) {
                    var content = render(val, elem);
                    if (typeof content === "string") {
                        elem.innerHTML = content;
                    }
                });
            });
        },
        bindList: function (obs$, render) {
            elems.forEach(function (elem) {
                var prev$ = new BehaviorSubject([]);
                var subscription = obs$
                    .pipe(withLatestFrom(prev$), flatMap(function (_a) {
                    var next = _a[0], prev = _a[1];
                    return [
                        arrayDiffs(prev, next, isEqual),
                        defer(function () { return prev$.next(Object.assign([], next)); }),
                    ];
                }), mergeAll())
                    .subscribe(function (change) {
                    console.log("CHANGE", change);
                    switch (change.type) {
                        case "create": {
                            var child = parseHTML(render(change.item, change.idx));
                            child.setAttribute("data-key", String(change.idx));
                            elem.appendChild(child);
                            break;
                        }
                        case "update": {
                            var rowEl = elem.children.item(change.idx);
                            if (rowEl) {
                                var child = parseHTML(render(change.item, change.idx));
                                child.setAttribute("data-key", String(change.idx));
                                rowEl.replaceWith(child);
                            }
                            break;
                        }
                        case "delete": {
                            var rowEl = elem.children.item(change.idx);
                            rowEl && rowEl.remove();
                            break;
                        }
                    }
                });
                if (elem.parentNode) {
                    var elemObs = new MutationObserver(function (mutlist) {
                        mutlist
                            .flatMap(function (mut) { return Array.from(mut.removedNodes); })
                            .forEach(function (removedNode) {
                            if (removedNode.isEqualNode(elem.parentNode)) {
                                console.log("unsub!");
                                subscription.unsubscribe();
                            }
                        });
                    });
                    elemObs.observe(document.body, { childList: true });
                }
            });
        },
        on: function (evtType, targetOrFn, fn) {
            elems.forEach(function (elem) {
                elem.addEventListener(evtType, function (evt) {
                    if (typeof targetOrFn === "string" && typeof fn === "function") {
                        var $target = $(targetOrFn, elem);
                        var containsTarget = function (el) {
                            if (!(evt.target instanceof Node))
                                return false;
                            if (!el.contains(evt.target))
                                return false;
                            return true;
                        };
                        $target.elems.filter(containsTarget).forEach(function (elem) {
                            var overload = { mainTarget: elem, key: Number(elem.getAttribute("data-key")) };
                            fn(Object.assign(evt, overload));
                        });
                    }
                    else if (typeof targetOrFn === "function") {
                        var overload = { mainTarget: elem, key: Number(elem.getAttribute("data-key")) };
                        targetOrFn(Object.assign(evt, overload));
                    }
                });
            });
        },
    };
    return Object.assign({ elem: elem, elems: elems }, bindings);
}
function $(selector, parent) {
    var root = parent || document;
    var sanitizedSelector = selector.trim();
    if (sanitizedSelector.length === 0)
        return trexFactory([]);
    return trexFactory(Array.from(root.querySelectorAll(selector)).reduce(function (elements, el) { return (el instanceof HTMLElement ? __spreadArrays(elements, [el]) : elements); }, []));
}
function parseHTML(html) {
    var wrapper = document.createElement("template");
    wrapper.innerHTML = html.trim();
    var elem = wrapper.content.firstElementChild;
    if (!(elem instanceof HTMLElement))
        throw "Parsing element failed!";
    return elem;
}

export { $ };
//# sourceMappingURL=index.esm.js.map
