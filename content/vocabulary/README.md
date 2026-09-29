# Vocabulary and phrase packs

Learner-dictionary cards for English Corner. Each pack is one theme at one CEFR level. Glosses and examples are original teaching text in American English, written for conversation practice.

Counts live in `manifest.json` and are computed from the pack files.

## Layout

- `packs/pack-{theme}-{level}.json` — one file per theme and level
- `manifest.json` — entry totals by type, level, and theme

Entry ids look like `voc-food-a1-001`. Pack ids look like `pack-food-a1`.

## Levels

`A1`, `A2`, `B1`, `B2`, `C1`

## Themes

`greetings`, `food`, `shopping`, `transport`, `housing`, `health`, `weather`, `hobbies`, `school`, `study-skills`, `presentations`, `meetings`, `email`, `job-interview`, `workplace`, `travel-problems`, `culture-shock`, `small-talk`, `opinions`, `idioms`, `phrasal-verbs`, `academic-writing`, `exams`, `emotions`, `money`, `technology`, `environment`, `news`, `storytelling`

## Entry types

`word`, `phrase`, `collocation`, `idiom`

A collocation card uses the whole chunk as the headword (`make a decision`). An idiom card gives the non-literal meaning and a natural example that uses the expression. Word cards may list related collocations as short hints.

## Card fields

`id`, `type`, `headword`, `pos`, `definition`, `example`, `level`, `theme`, `collocations`

The example uses the headword in a sentence that matches the card’s level.
