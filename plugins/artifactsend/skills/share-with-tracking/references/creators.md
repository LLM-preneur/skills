# Made with another skill: export recipes

Each recipe ends with one `send_artifact` call after the single confirmation in SKILL.md. Send the finished output, never the project folder.

Limits that apply to every recipe:

- `document`: PDF, Word (.docx, .doc, .odt, .rtf), PowerPoint (.pptx, .ppt, .odp), Excel (.xlsx, .xls, .ods, .csv) or an image (.png, .jpg, .gif, .webp). Up to 40 MB. Keynote files are not read, so export to PDF or PowerPoint first.
- `files` next to an `html` page: up to 100 files, 10 MB each, 40 MB in all. Images, video (.mp4, .webm, .mov), audio, fonts, CSS, JS, JSON, CSV, text and PDF. Paths are relative, like `media/demo.mp4`. `index.html` is reserved for the page itself.
- Too big? Say so and stop. Never drop content to make it fit.

## Office files from the pptx, docx, xlsx or pdf skill

1. Use the file the skill wrote, e.g. `deck.pptx`, `memo.docx`, `model.xlsx` or `report.pdf`.
2. Read its bytes and base64 them, e.g. `base64 -i deck.pptx` on macOS or `base64 -w0 deck.pptx` on Linux.
3. `send_artifact` with `document: { name: "deck.pptx", base64: "..." }` and a `title`.

Readers get pages, slides or sheets in the browser. Downloads stay off unless the user turns them on.

## HTML from frontend-design, Claude Code, Codex or Cursor

1. Find the page the user will send, e.g. `report.html` or `dist/index.html`.
2. List every local `src`, `href` and CSS `url(...)` it uses.
3. Relative paths become `files` entries with the same `path`. Absolute local paths (`file://`, `/Users/...`, `C:\...`, `localhost`) will not load for readers. Rewrite them as relative paths or inline them.
4. If the page fetches from a local server or a private API, tell the user it will not work for readers. Offer a static export with the data baked in.
5. `send_artifact` with `html` (the whole file) and `files`.

A built app (Vite, Next.js) that loads its assets from absolute paths like `/assets/app.js` will not find them. Build it with a relative base, or send a static export.

## Slidev

1. Install the exporter once in the deck's project: `npm i -D playwright-chromium`.
2. `slidev export` writes `slides-export.pdf`. `slidev export --format pptx` makes a PowerPoint with each slide as an image, so its text is not selectable.
3. `send_artifact` with the PDF (or PPTX) as `document`.

Prefer the PDF, since its text stays selectable.

## Marp

- PDF: `marp --pdf deck.md` (or `npx @marp-team/marp-cli@latest --pdf deck.md`), then `document`.
- PowerPoint: `marp --pptx deck.md`, then `document`.
- HTML: `marp deck.md -o deck.html`, then `html`, with local images in `files`.

PDF and PPTX conversion needs Chrome, Edge or Firefox. Local images in those need `--allow-local-files`. Use it only on Markdown the user wrote or trusts.

## reveal.js

A reveal.js deck is one HTML page. Send it as `html`. Put its local `reveal.js`, CSS, theme and image files in `files` with their relative paths. A deck that loads reveal.js from a public CDN needs only the page and its images.

## Video from HeyGen, Higgsfield or another video tool's MCP

A video tool connected to the same AI app returns the finished video's address. Pass it straight to ArtifactSend:

1. Wait until the tool says the video is done, then take its address. HeyGen: `get_video` returns `video_url` once the status is completed (the address expires, so share soon after or ask HeyGen again). Higgsfield: the clip's address in the result; the same clip is in Assets on higgsfield.ai.
2. `send_artifact` with `video_url` set to that address, plus the user's door words (`access`, `allow`, `expires_in_days`, `notify`). Leave out `link`: a video always gets a new link.
3. Show the link and its settings. One link per viewer: `link_for_person` on the video link.

`video_url` takes a public mp4, webm or mov up to 200 MB. A page or an expired address is refused with the reason. A video sent as `url` is treated the same way.

## A video file on this computer (HyperFrames, a screen recording, a camera)

1. HyperFrames: render the composition, `npx hyperframes render --output demo.mp4`. Without `--output` it writes to `renders/<project>_<date>_<time>.mp4`.
2. `start_upload` with `file_name: "demo.mp4"` and the door settings. It returns one command that sends the file in 8 MB parts and prints the link as JSON. Put the real path in it, keep the quotes, and run it.

Up to 200 MB, mp4, webm or mov. The reader gets a player; downloads stay off unless `downloads` is on.

## What the report says about a video

`link_report` on a video link adds `video`: who watched each part (`whoWatchedEachPart`), `biggestDropOff` and `watchedAgain`. Each viewer in `readers_list` has `watched` (such as "2:14 of 3:05 (72%)"), `skipped` and `watchedAgain`. Watching is counted per 10 seconds; a part counts after 2 seconds.

## HyperFrames video as a page (small files only)

1. Render the composition: `npx hyperframes render --output demo.mp4`. Without `--output` it writes to `renders/<project>_<date>_<time>.mp4`.
2. Write a small page that plays it: `<video src="media/demo.mp4" controls playsinline style="width:100%"></video>`, with a heading for the title.
3. `send_artifact` with that `html` and `files: [{ path: "media/demo.mp4", base64: "..." }]`.

Use this only to put a short clip inside a page of your own: the MP4 must be 10 MB or less, and the report counts time on the page, not watch time. For a video on its own, use `start_upload` above.

## Markdown report

Send the text as `markdown`. If it shows local images, send it as an `html` page with the images in `files`, or use public image URLs.

## Claude artifact

Send the complete code from this chat. An HTML artifact goes as `html`. A React artifact goes as `react` (one file with a default export). A link that already opens on claude.ai shows as `onClaudeOnly` in `list_links`. `update_artifact` with its complete HTML brings it in with the same readers.
