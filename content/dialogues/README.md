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

`manifest.json` records `dialogueCount`, `turnCount`, `byLevel`, and `byDomain`. Those numbers are the sum of the JSON files in this folder.
