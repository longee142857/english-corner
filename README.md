# English Corner

English Corner (英语角) is a study room for speaking practice. You pick a level from A1 to C1, warm up with a topic, rehearse a dialogue in one role, then keep the phrases on cards. Readings, listening scripts, and debate motions sit on the same shelf.

The materials in `content/` are original study content written for this app. They are not excerpts from textbooks or exam papers.

## Run locally

```bash
npm install
npm run dev
```

The dev server listens on [http://127.0.0.1:43123](http://127.0.0.1:43123) (bound to `0.0.0.0`).

```bash
npm run build
npm start
```

`npm run build` compiles the Next.js app. Pages read `content/` from the filesystem when they render, so a new corpus is picked up on the next request in dev, and after `npm run build` in production. You do not rewrite pages to add files.

## Content layout

Loaders read every `*.json` file in these folders. Sample fixtures use a `sample-` id prefix. Leave them, or delete them, when the full corpus arrives. No code change is required.

| Path | Shape |
| --- | --- |
| `content/curriculum/topics.json` | Array of topics |
| `content/dialogues/*.json` | Each file is an array of dialogues |
| `content/vocabulary/packs/*.json` | One pack object per file |
| `content/reading/*.json` | Each file is an array of reading passages |
| `content/listening/*.json` | Each file is an array of roleplay scripts |
| `content/debates/motions.json` | Array of motions |
| `content/index.json` | Optional light index. If this file is absent, the app scans the folders above. |

Levels: `A1` `A2` `B1` `B2` `C1`.

Domains: `daily-life` `campus` `travel` `academic` `career` `culture` `exam` `interview` `debate`.

Lists use a light index (id, title, level, domain, kind, theme, headword, situation, motion) and are paginated. A detail page loads one dialogue, pack, passage, script, or motion.

### Optional `content/index.json`

Either a JSON array of light records, or an object:

```json
{
  "records": [],
  "packs": []
}
```

A record may include `id`, `title`, `level`, `domain`, `kind`, `themes`, `headword`, `situation`, `motion`, `href`, `packId`, and `sourceFile` (path relative to `content/`). `sourceFile` lets a detail page open one file instead of scanning. `kind` is `topic`, `dialogue`, `vocab`, `reading`, `listening`, or `debate`.

## Favorites

Stars are stored in the browser under the localStorage key `english-corner-favorites`, as an array of `{ id, kind, title, href }`.

## Routes

- `/` session intro, levels, domains, and shelf counts
- `/levels` A1–C1 can-do blurbs
- `/topics` and `/topics/[id]`
- `/practice` and `/practice/[id]`
- `/flashcards` and `/flashcards/[id]`
- `/search`
- `/favorites`
- `/read` and `/read/[id]`
- `/listen` and `/listen/[id]`
- `/debates` and `/debates/[id]`
