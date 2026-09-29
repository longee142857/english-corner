# Situational dialogues

Original spoken dialogues for English Corner practice. Each item is a new situation with roles, turns, partner follow-ups, and useful phrases.

## Files

Files are named `{domain}-{level}-{nn}.json`. Each file is a JSON array of dialogues for one domain and one CEFR level.

Closed values:

- Levels: `A1`, `A2`, `B1`, `B2`, `C1`
- Domains: `daily-life`, `campus`, `travel`, `academic`, `career`, `culture`, `exam`, `interview`, `debate`

## Dialogue fields

- `id`: `dlg-{domain}-{level}-{nnn}` (level in the id is lowercase)
- `title`, `situation`, `roles`, `turns`
- `themes`: tags from the project theme list
- `followUps`: at least three prompts a partner can use to continue
- `usefulPhrases`: at least three phrases to notice or reuse
- `source`: `original` for this bank

Turns use the strings in `roles`. A1 lines stay short and concrete. Higher levels add reasons, softeners, and discourse markers.

## Counts

`manifest.json` is the source of truth. This bank has 300 dialogues and 2408 turns.

| Level | Dialogues |
| --- | --- |
| A1 | 60 |
| A2 | 100 |
| B1 | 60 |
| B2 | 60 |
| C1 | 20 |

| Domain | Dialogues |
| --- | --- |
| daily-life | 40 |
| campus | 40 |
| travel | 40 |
| academic | 20 |
| career | 20 |
| culture | 40 |
| exam | 40 |
| interview | 40 |
| debate | 20 |

Files: `daily-life-a1-01`, `daily-life-a2-01`, `campus-a1-01`, `campus-a2-01`, `travel-a1-01`, `travel-a2-01`, `academic-b1-01`, `career-b1-01`, `culture-a2-01`, `culture-b2-01`, `exam-a2-01`, `exam-b2-01`, `interview-b1-01`, `interview-c1-01`, `debate-b2-01`.
