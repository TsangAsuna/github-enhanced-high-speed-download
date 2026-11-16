# GitHub Enhancement - High Speed Download (patched)

A patched build of [XIU2/UserScript](https://github.com/XIU2/UserScript)'s
`GithubEnhanced-High-Speed-Download.user.js`, focused on three things:

1. Every acceleration mirror is **verified by live download**, not just HTTP status.
2. `git clone` acceleration works again after GitHub's UI redesign.
3. The per-file button row no longer covers the filename.

Original script: <https://greasyfork.org/scripts/412245>
Original author: [X.I.U](https://github.com/XIU2) · License: GPL-3.0

## Install

Open the raw file and install it in Tampermonkey / Violentmonkey:

```
https://raw.githubusercontent.com/TsangAsuna/github-enhanced-high-speed-download/main/GithubEnhanced-High-Speed-Download.user.js
```

> This fork sets its own `@updateURL`. It will **not** be silently replaced by
> the Greasy Fork original.

## What changed

### Display: one dropdown per file

The original laid all mirror buttons inline beside each release asset. Measured
at **1153px wide inside a 574px container** — it overflowed by 579px and covered
the filename.

Now each asset row shows a single `加速 N` pill. Clicking opens a floating panel
listing mirror name + region. Row height stays 45px, filename keeps full width,
panel is never clipped, closes on outside click or `Esc`.

`Download ZIP` uses the same dropdown instead of N stacked buttons.

### Mirrors: verified, not assumed

All endpoints were tested by downloading a real file and comparing SHA-256
against GitHub native — not by checking for HTTP 200.

| Type | Count | Verification |
| --- | --- | --- |
| Release / archive | 18 | byte-identical SHA-256 |
| `git clone` | 15 | correct 40-char commit SHA |
| Raw | 12 | byte-identical SHA-256 |
| SSH | 1 | `ssh://git@ssh.github.com:443/` |

Dead endpoints were removed, including `gh.h233.eu.org` (403/1034),
`gh.ddlc.top` (429/1027), `xget.xi-xu.me` (429/1027), and `ghfast.top` (timeout).

Sources that had been wrongly dropped while still alive were restored:
`githubfast.com`, `hub.glowp.xyz`, `fastgit.cc`, `proxy.yaoyaoling.net`,
`gcore.jsdelivr.net`, `jsd.proxy.aks.moe`.

### Logic fixes

- `git clone` mirrors not rendering — GitHub replaced `LocalTab-module__`
  with `SegmentedControl` / `CloneContainer__`.
- `/releases` acceleration never scheduled on first page load.
- `indexOf('/releases')` truthiness bug (missing `> -1`).
- `return` instead of `continue` inside the mutation observer loop.
- Null `nextElementSibling` crashes.
- Idempotency flags written before insert succeeded, blocking retries.
- The "switch source" menu now opens a numbered picker with a `← 当前` marker
  and reloads the page, instead of blindly cycling to the next source.

## Notes on upstream sync

Upstream `XIU2/UserScript` is a 26-script monorepo. This repository carries only
the one script we patched, so it is not a GitHub fork and cannot open PRs
against upstream. To pull future upstream changes, diff against:

```
https://raw.githubusercontent.com/XIU2/UserScript/master/GithubEnhanced-High-Speed-Download.user.js
```
