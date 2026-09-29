# Curriculum topic tree

Browseable lesson topics for English Corner (英语角). Each topic is an original CEFR-style lesson seed: a title, a short summary, can-do statements, a concrete lesson outline, conversation prompts, grammar focus, and functions.

This folder is content only. It does not start a web app.

## Files

| File | Role |
| --- | --- |
| `topics.json` | The topic list. One object per lesson. |
| `manifest.json` | `topicCount`, `byLevel`, and `byDomain`. These counts are generated from `topics.json` and must match it. |

## Volume

100 topics: 20 each at A1, A2, B1, B2, and C1.

Every level includes all nine domains. At each level there is at least one topic in `daily-life`, `academic`, `career`, `culture`, and `exam`.

| Domain | Topics |
| --- | ---: |
| daily-life | 14 |
| campus | 11 |
| travel | 11 |
| academic | 12 |
| career | 11 |
| culture | 10 |
| exam | 10 |
| interview | 11 |
| debate | 10 |

## Closed vocabularies

Levels: `A1`, `A2`, `B1`, `B2`, `C1`.

Domains: `daily-life`, `campus`, `travel`, `academic`, `career`, `culture`, `exam`, `interview`, `debate`.

Themes are a subset chosen per topic, from: `greetings`, `food`, `shopping`, `transport`, `housing`, `health`, `weather`, `hobbies`, `school`, `study-skills`, `presentations`, `meetings`, `email`, `job-interview`, `workplace`, `travel-problems`, `culture-shock`, `small-talk`, `opinions`, `idioms`, `phrasal-verbs`, `academic-writing`, `exams`, `emotions`, `money`, `technology`, `environment`, `news`, `storytelling`.

## Topic shape

```json
{
  "id": "topic-a1-daily-life-greetings",
  "level": "A1",
  "domain": "daily-life",
  "themes": ["greetings", "small-talk"],
  "title": "Saying hello and goodbye",
  "summary": "One or two sentences.",
  "canDo": ["I can greet someone and say where I am from."],
  "lessonOutline": ["Six to eight concrete steps."],
  "conversationPrompts": ["At least four specific situations."],
  "grammarFocus": ["be"],
  "functions": ["greeting"]
}
```

Ids are stable kebab-case strings prefixed with `topic-`.

## How to check the counts

From the repo root:

```bash
python3 -c "import json; t=json.load(open('content/curriculum/topics.json')); m=json.load(open('content/curriculum/manifest.json')); assert m['topicCount']==len(t)"
```
