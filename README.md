# relative-keyword-relevance

An [ObjectiveAI](https://objective-ai.io) Function for ranking multiple content items by keyword relevance using ensemble LLM voting.

> **ObjectiveAI** is a platform for scoring, ranking, and simulating preferences using ensembles of LLMs. Learn more at [objective-ai.io](https://objective-ai.io) or see the [GitHub repository](https://github.com/ObjectiveAI/objectiveai).

## Overview

This function ranks multiple content items by their relevance to a set of keywords, returning a vector of scores that sum to 1. Unlike `keyword-relevance` which scores a single piece of content, this function compares multiple items against each other to determine relative relevance.

It combines three evaluation strategies for robust rankings:

1. **Individual scoring** (`keyword-relevance`) - Scores each content item independently, then normalizes to produce relative rankings
2. **Joined** (`relative-keyword-relevance-joined`) - Compares all items in a single prompt with all keywords combined
3. **Split** (`relative-keyword-relevance-split`) - Compares items separately for each keyword, then averages

The final ranking is the average of all three strategies.

## Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `keywords` | `string[]` | Yes | Keywords to evaluate relevance against (minimum 1) |
| `contentItems` | `array` | Yes | Content items to rank (minimum 2) |

### Supported Content Types

Each item in `contentItems` can be:

- **Text** - Plain text strings
- **Image** - Image content
- **Video** - Video content
- **Audio** - Audio content
- **File** - File content
- **Array** - Multiple content pieces combined

## Output

A vector of scores, one per content item, that sum to 1:

| Score | Interpretation |
|-------|----------------|
| Higher | More relevant to the keywords |
| Lower | Less relevant to the keywords |

Example output for 3 content items: `[0.6, 0.15, 0.25]`

## Example

```json
{
  "input": {
    "keywords": ["artificial intelligence", "machine learning"],
    "contentItems": [
      "Deep learning models are transforming AI applications.",
      "The weather today is sunny and warm.",
      "Neural networks enable machine learning breakthroughs."
    ]
  }
}
```

Output: `[0.45, 0.05, 0.50]` - Items 1 and 3 are highly relevant, item 2 is not.

## How It Works

1. Scores each content item using `keyword-relevance`, then L1-normalizes the scores
2. Ranks items using `relative-keyword-relevance-joined` (single comparison with all keywords)
3. Ranks items using `relative-keyword-relevance-split` (separate comparison per keyword)
4. Averages all three ranking vectors for the final result

This multi-strategy approach provides reliable rankings by combining:
- **Absolute evaluation** - How relevant is each item on its own?
- **Holistic comparison** - Which item best matches all keywords together?
- **Granular comparison** - Which item best matches each keyword individually?

## Default Profile

The default profile delegates to the sub-functions' profiles, supporting multi-modal content evaluation.

## Related Functions

- [WiggidyW/keyword-relevance](https://github.com/WiggidyW/keyword-relevance) - Scores a single content item
- [WiggidyW/relative-keyword-relevance-joined](https://github.com/WiggidyW/relative-keyword-relevance-joined) - Single-prompt ranking
- [WiggidyW/relative-keyword-relevance-split](https://github.com/WiggidyW/relative-keyword-relevance-split) - Per-keyword ranking
