import { Functions } from "objectiveai";
import { ExampleInput } from "./example_input";

export const Function: Functions.RemoteFunction = {
  type: "vector.function",
  description:
    "Keyword-based Relevance Rankings.  Discover which piece of content is most relevant to specific keywords.",
  input_schema: {
    type: "object",
    properties: {
      keywords: {
        type: "array",
        description: "Keywords to evaluate relevance against.",
        minItems: 1,
        items: {
          type: "string",
          description: "A keyword to evaluate relevance against.",
        },
      },
      contentItems: {
        type: "array",
        description: "Content items to be ranked for relevance.",
        minItems: 1,
        items: {
          anyOf: [
            {
              type: "string",
              description: "Text content to be evaluated for relevance.",
            },
            {
              type: "image",
              description: "Image content to be evaluated for relevance.",
            },
            {
              type: "video",
              description: "Video content to be evaluated for relevance.",
            },
            {
              type: "audio",
              description: "Audio content to be evaluated for relevance.",
            },
            {
              type: "file",
              description: "File content to be evaluated for relevance.",
            },
            {
              type: "array",
              description:
                "Array of content pieces to be evaluated for relevance.",
              minItems: 1,
              items: {
                anyOf: [
                  {
                    type: "string",
                    description: "Text content to be evaluated for relevance.",
                  },
                  {
                    type: "image",
                    description: "Image content to be evaluated for relevance.",
                  },
                  {
                    type: "video",
                    description: "Video content to be evaluated for relevance.",
                  },
                  {
                    type: "audio",
                    description: "Audio content to be evaluated for relevance.",
                  },
                  {
                    type: "file",
                    description: "File content to be evaluated for relevance.",
                  },
                ],
              },
            },
          ],
        },
      },
    },
    required: ["keywords", "contentItems"],
  },
  input_maps: {
    $jmespath: "to_array(input.contentItems)",
  },
  tasks: [
    {
      type: "scalar.function",
      owner: "WiggidyW",
      repository: "keyword-relevance",
      commit: "944cf3958865ab4a3ae2162ee29fdf5505191bc3",
      map: 0,
      input: {
        $jmespath: "@.{keywords:input.keywords,content:map}",
      },
    },
    {
      type: "vector.function",
      owner: "WiggidyW",
      repository: "relative-keyword-relevance-joined",
      commit: "d87ff5f49e7a49c45bf911cc5dfd31edbba0c757",
      input: {
        $jmespath: "input",
      },
    },
    {
      type: "vector.function",
      owner: "WiggidyW",
      repository: "relative-keyword-relevance-split",
      commit: "e691a7735c3d58cdf3535e47ed5cd70505060aa8",
      input: {
        $jmespath: "input",
      },
    },
  ],
  output: {
    $jmespath: "zip_map(&avg(@),[l1_normalize(tasks[0]),tasks[1],tasks[2]])",
  },
  output_length: {
    $jmespath: "length(input.contentItems)",
  },
  input_split: {
    $jmespath:
      "zip_map(&{keywords:@[0],contentItems:[@[1]]},[repeat(input.keywords,length(input.contentItems)),input.contentItems])",
  },
  input_merge: {
    $jmespath:
      "@.{keywords:input[0].keywords,contentItems:input[].contentItems[0]}",
  },
};

export const Profile: Functions.RemoteProfile = {
  description:
    "The default profile for `WiggidyW/relative-keyword-relevance`. Supports multi-modal content.",
  tasks: [
    {
      owner: "WiggidyW",
      repository: "keyword-relevance",
      commit: "944cf3958865ab4a3ae2162ee29fdf5505191bc3",
    },
    {
      owner: "WiggidyW",
      repository: "relative-keyword-relevance-joined",
      commit: "d87ff5f49e7a49c45bf911cc5dfd31edbba0c757",
    },
    {
      owner: "WiggidyW",
      repository: "relative-keyword-relevance-split",
      commit: "e691a7735c3d58cdf3535e47ed5cd70505060aa8",
    },
  ],
};

export const ExampleInputs: ExampleInput[] = [
  {
    value: {
      keywords: ["Python programming", "data science"],
      contentItems: [
        "NumPy and Pandas are essential libraries for data manipulation in Python. They provide efficient array operations and DataFrame structures for handling large datasets.",
        "The recipe calls for two cups of flour, one egg, and a pinch of salt. Mix until smooth and let rest for thirty minutes before cooking.",
        "Python's scikit-learn library offers various machine learning algorithms including regression, classification, and clustering methods.",
      ],
    },
    compiledTasks: [
      {
        type: "scalar.function",
        skipped: false,
        mapped: 3,
      },
      {
        type: "vector.function",
        skipped: false,
        mapped: null,
      },
      {
        type: "vector.function",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: 3,
  },
  {
    value: {
      keywords: ["climate change", "renewable energy"],
      contentItems: [
        "Solar panel efficiency has increased dramatically over the past decade while costs have plummeted making residential installation economically viable for millions of homeowners",
        "my uncle frank still insists that the weather was colder when he was a kid... ok boomer lol",
        "The Paris Agreement aims to limit global temperature increase to 1.5°C above pre-industrial levels through coordinated international action on emissions reduction.",
        "Just bought a new gas-powered lawnmower! This baby has a 190cc engine and can handle even the thickest grass. Can't wait to fire it up this weekend.",
      ],
    },
    compiledTasks: [
      {
        type: "scalar.function",
        skipped: false,
        mapped: 4,
      },
      {
        type: "vector.function",
        skipped: false,
        mapped: null,
      },
      {
        type: "vector.function",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: 4,
  },
  {
    value: {
      keywords: ["sushi", "Japanese cuisine"],
      contentItems: [
        "The itamae carefully sliced the bluefin tuna, placing each piece atop perfectly seasoned shari rice with a dab of freshly grated wasabi between them.",
        "BEST TACOS IN TOWN!!! 🌮🌮🌮 Authentic Mexican flavors, handmade tortillas, incredible carne asada. Open late on weekends!",
      ],
    },
    compiledTasks: [
      {
        type: "scalar.function",
        skipped: false,
        mapped: 2,
      },
      {
        type: "vector.function",
        skipped: false,
        mapped: null,
      },
      {
        type: "vector.function",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: 2,
  },
  {
    value: {
      keywords: ["minimalist design"],
      contentItems: [
        "Less is more. The room contained only a single white chair, a small wooden table, and diffused natural light from the floor-to-ceiling window.",
        "OMG YOU WONT BELIEVE THIS CRAZY SALE!!! EVERYTHING MUST GO!!! DECORATIONS, FURNITURE, KNICK-KNACKS, COLLECTIBLES!!! BIGGEST SELECTION EVER!!! 🎉🎊✨💥",
        "The interface employs generous whitespace and a restrained color palette of black, white, and a single accent blue.",
        "idk maybe its minimalist?? theres like... not much stuff i guess?? hard to tell tbh",
      ],
    },
    compiledTasks: [
      {
        type: "scalar.function",
        skipped: false,
        mapped: 4,
      },
      {
        type: "vector.function",
        skipped: false,
        mapped: null,
      },
      {
        type: "vector.function",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: 4,
  },
  {
    value: {
      keywords: [
        "artificial intelligence",
        "machine learning",
        "neural networks",
      ],
      contentItems: [
        "Transformers architecture, introduced in 'Attention Is All You Need' (2017), revolutionized NLP by enabling parallel processing of sequential data through self-attention mechanisms.",
        "My toaster is pretty smart I guess? It knows when the bread is done and pops it up automatically. Technology these days am I right",
        "GPT-4 demonstrates emergent capabilities in reasoning, code generation, and multimodal understanding that were not explicitly trained but arise from scale.",
      ],
    },
    compiledTasks: [
      {
        type: "scalar.function",
        skipped: false,
        mapped: 3,
      },
      {
        type: "vector.function",
        skipped: false,
        mapped: null,
      },
      {
        type: "vector.function",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: 3,
  },
  {
    value: {
      keywords: ["hiking", "outdoor recreation"],
      contentItems: [
        "The Appalachian Trail stretches 2,190 miles from Georgia to Maine, typically taking thru-hikers 5-7 months to complete.",
        "walked from my car to the office today without an umbrella and got SOAKED. worst hike of my life 0/10 would not recommend",
        "Proper layering is essential: moisture-wicking base layer, insulating mid-layer, and waterproof outer shell.",
        "Netflix marathon this weekend! Starting with that new documentary about mountains or whatever. Close enough to nature right?",
        "Trekking poles reduce knee strain by up to 25% on descents and improve stability on uneven terrain.",
      ],
    },
    compiledTasks: [
      {
        type: "scalar.function",
        skipped: false,
        mapped: 5,
      },
      {
        type: "vector.function",
        skipped: false,
        mapped: null,
      },
      {
        type: "vector.function",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: 5,
  },
  {
    value: {
      keywords: ["dentistry", "oral health"],
      contentItems: [
        "Flossing removes plaque and food particles from between teeth where toothbrush bristles cannot reach, preventing gingivitis and periodontal disease.",
        "Bought new wireless earbuds yesterday. The sound quality is incredible and they fit perfectly in my ears!",
      ],
    },
    compiledTasks: [
      {
        type: "scalar.function",
        skipped: false,
        mapped: 2,
      },
      {
        type: "vector.function",
        skipped: false,
        mapped: null,
      },
      {
        type: "vector.function",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: 2,
  },
  {
    value: {
      keywords: ["chess", "strategy games"],
      contentItems: [
        "The Sicilian Defense (1.e4 c5) is Black's most popular response to 1.e4, leading to asymmetrical positions with chances for both sides.",
        "Checkmate! My three-year-old just beat me at Candy Land for the fifth time today. That kid is ruthless.",
        "Magnus Carlsen's intuitive playing style combines deep calculation with psychological pressure, making him dominant in both classical and rapid formats.",
      ],
    },
    compiledTasks: [
      {
        type: "scalar.function",
        skipped: false,
        mapped: 3,
      },
      {
        type: "vector.function",
        skipped: false,
        mapped: null,
      },
      {
        type: "vector.function",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: 3,
  },
  {
    value: {
      keywords: ["woodworking", "carpentry", "furniture making"],
      contentItems: [
        "Dovetail joints provide exceptional strength for drawer construction. Cut the tails first at an 8:1 ratio for hardwoods, then scribe and chop the pins.",
        "The wooden spoon in my kitchen drawer is like 20 years old. Still works fine I guess.",
        "LOOKING FOR: Someone to assemble IKEA furniture. Will pay $50. Must have own tools. DM if interested.",
        "Japanese hand planes (kanna) cut on the pull stroke, allowing for finer control and thinner shavings than Western push planes.",
      ],
    },
    compiledTasks: [
      {
        type: "scalar.function",
        skipped: false,
        mapped: 4,
      },
      {
        type: "vector.function",
        skipped: false,
        mapped: null,
      },
      {
        type: "vector.function",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: 4,
  },
  {
    value: {
      keywords: ["cryptocurrency", "Bitcoin", "blockchain"],
      contentItems: [
        "The SHA-256 hashing algorithm underpins Bitcoin's proof-of-work consensus mechanism, requiring miners to find nonces that produce hashes below a target difficulty.",
        "i found a quarter on the ground today!! free money baby 💰",
        "DeFi protocols enable permissionless lending, borrowing, and trading through smart contracts deployed on Ethereum and other programmable blockchains.",
        "My grandpa still keeps his savings under his mattress. Says he doesn't trust 'computer money' lol",
      ],
    },
    compiledTasks: [
      {
        type: "scalar.function",
        skipped: false,
        mapped: 4,
      },
      {
        type: "vector.function",
        skipped: false,
        mapped: null,
      },
      {
        type: "vector.function",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: 4,
  },
];
