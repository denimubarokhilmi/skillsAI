---
name: humanizer
description: >
  Edit academic or professional writing (Indonesian/English) so it reads
  as natural, varied prose instead of generic LLM output: uneven sentence
  rhythm, fewer stock transition words and lexical clichés (delve,
  testament, underscoring, groundbreaking, etc.), a clear authorial
  stance, and concrete rather than generic detail. Use when the user
  says "make this sound more natural", "this reads too robotic/AI-ish",
  "remove the AI clichés", "vary the sentences", "hilangkan gaya
  kaku/AI banget", or asks for a prose pass on a draft that currently
  reads stiff or formulaic. This is a style editor for prose quality,
  not a tool for disguising a text's origin or defeating plagiarism/
  AI-detection tools — do not use it, and do not market it, that way.
---

# Humanizer: Natural Prose Editor

Improve the craft of a piece of writing — rhythm, word choice, stance, and concreteness — so it reads like it was written by an engaged person with a point of view, not assembled from safe, average phrasing. This is a legitimate editing skill for anyone's writing, including a user's own AI-assisted drafts; it is not a way to falsely represent authorship or evade detection systems, and it should never be framed or used that way.

## Boundary

This skill improves *how* a text reads. It does not:
- Claim or imply the output will "pass" or "bypass" any detector.
- Help present someone else's work, or an AI's unedited output, as the user's own original work in a context (school, publication) where that would be dishonest. If the user's request is explicitly about evading academic-integrity checks rather than improving the writing itself, decline that framing and offer the editing help on its own terms.

## What makes prose read stiff (diagnose first)

1. **Flat rhythm** — every sentence is a similar length. Real writing alternates short, punchy sentences with longer, more complex ones.
2. **Stock transitions** — heavy reliance on *Oleh karena itu*, *Selain itu*, *Dengan demikian*, *Furthermore*, *Moreover*, used as connective tissue between every paragraph instead of the ideas actually connecting.
3. **Sterile neutrality** — every claim hedged, no position taken, no critique offered.
4. **Generic detail** — abstractions and generalizations instead of specific, concrete observations, numbers, or examples.
5. **Repetition patterns** — "rule of three" phrase lists, synonym padding, formulaic conclusions ("In conclusion, ...").

## Edit passes

Work through these in order; each is a targeted pass over the same draft.

**1. Rhythm** — Read sentence lengths aloud in your head. Break up strings of three or more similarly-sized sentences. Let some sentences run short and blunt; let others carry real subordinate structure.

**2. Transitions** — Cut most stock transition words. Reconnect ideas through logical flow (the next sentence should follow from the content of the last one, not from a connector word bridging two unrelated ones). Occasional sentence-initial "But", "And", "Because" ("Tapi", "Dan", "Sebab") is fine and often reads more natural than the formal alternative.

**3. Stance** — Where the draft hedges everything, find the place where the author (the user) actually has a view, and sharpen it. Name a specific weakness in an approach instead of gesturing at "some limitations exist."

**4. Concreteness** — Replace generic claims with the specific detail the user has available: real numbers, a specific anomaly, a named example. If the user hasn't given you the specific detail, ask for it rather than inventing one.

**5. Cleanup** — Remove leftover AI-assistant artifacts and lexical clichés
(this list follows the same patterns Wikipedia's AI-cleanup guidance
flags, since they're well-documented tells regardless of platform):
- Placeholder values (*email@example.com*, *John Doe*), impossible or
  fictional dates, chatbot-style intros/outros ("Certainly! Here's..."),
  and formulaic conclusion paragraphs ("In conclusion, the future looks
  bright").
- **Significance inflation**: *testament*, *pivotal*, *crucial role*,
  *beacon*, *stands as a reminder*, *delve*, *evolving landscape*.
- **Promotional fluff**: *groundbreaking*, *seamless*, *powerful*,
  *synergy*, *unleash*, *revolutionize*.
- **Vague attribution**: *industry observers*, *many believe*, *some
  argue* without an actual citation or name.
- **-ing clichés**: replace *underscoring*, *highlighting*, *reflecting*,
  *showcasing* with a plain active verb (*shows*, *marks*, *proves*).
- **Rule-of-three / synonym cycling**: cut padded lists like "a partner,
  a guide, and a catalyst" down to the single best word.
- **Excessive hedging**: *could potentially be argued that*, *might
  possibly have some* → say the thing plainly; *in order to* → *to*.

## Output contract

Return the edited text plus a short changelog, e.g.:

```
## Changes
- Broke up 4 consecutive medium-length sentences in paragraph 2
- Cut 6 of 9 stock transitions; reconnected via content instead
- Removed significance inflation (cut "testament to the evolving landscape")
- Sharpened the stance in paragraph 4 (was: "there may be some drawbacks" → now names the specific drawback)
- Replaced 2 generic claims with the specific data points you gave me
```

If the input is missing detail an edit needs (a real example, an actual number), ask for it instead of fabricating one.
