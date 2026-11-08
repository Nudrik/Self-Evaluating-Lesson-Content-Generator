import { PipelineExecutionResult } from '../types/pipeline.js';

export const SAMPLE_RAG_RUN: PipelineExecutionResult = {
  id: 'run-rag-submission-benchmark',
  topic: 'Introduction to RAG (Retrieval-Augmented Generation)',
  learnerLevel: 'Absolute Beginner (Starts from Zero)',
  status: 'SHIPPED',
  finalVerdict: 'SHIPPED',
  metrics: {
    totalDurationMs: 4820,
    totalAttempts: 2,
    retryCount: 1,
    initialPassCount: 4,
    finalPassCount: 6,
  },
  iterations: [
    {
      iteration: 1,
      status: 'EVALUATED_FAILED',
      timestamp: Date.now() - 3600000,
      durationMs: 2310,
      promptUsed: 'Topic: "Introduction to RAG"\nSYSTEM MEMORY: Use open-book exam metaphor...',
      lesson: {
        topic: 'Introduction to RAG (Retrieval-Augmented Generation)',
        title: 'RAG Explained: Giving AI an Open-Book Exam',
        hook: 'Imagine taking a difficult final exam relying solely on what you memorized months ago, versus taking the exact same exam with an open textbook and search index at your fingertips.',
        mentalModel: {
          title: 'The Closed-Book vs Open-Book Exam Metaphor',
          analogy: 'Standard AI models operate like a student in a strict closed-book test. Everything they say comes from their static memory frozen at graduation day. RAG turns the test into an open-book exam: before writing an answer, the student walks over to a reference shelf, pulls the exact two relevant pages, and uses them to write an accurate, up-to-date answer.',
          takeaway: 'RAG doesn\'t make the student smarter; it gives them instant access to the right notes at the right second.'
        },
        whatItIs: 'RAG stands for Retrieval-Augmented Generation. It is an architectural technique that combines a smart retrieval engine with a language model.',
        whyItMatters: {
          problemSolved: 'Standard AI models suffer from two big problems: hallucinations (confidently making up convincing falsehoods) and outdated knowledge (they do not know what happened yesterday or what is inside your private documents).',
          consequencesOfNotUsing: 'Without RAG, an AI asked about your company internal policy will either guess or state it cannot know.'
        },
        howItWorks: [
          {
            stepNumber: 1,
            title: 'Knowledge Indexing',
            explanation: 'Your source documents (PDFs, manuals, websites) are divided into bite-sized paragraphs. These paragraphs are converted into vector embeddings and saved in a vector database.',
            analogyTip: 'Like assigning a unique catalog number to every book.'
          },
          {
            stepNumber: 2,
            title: 'Semantic Retrieval',
            explanation: 'When a user asks a query, the system performs a cosine similarity search across the vector space to grab the most relevant chunks.',
            analogyTip: 'Like a librarian finding the best matching book.'
          },
          {
            stepNumber: 3,
            title: 'Augmented Generation',
            explanation: 'The system pastes the user query and the retrieved snippets into a single prompt for the AI to synthesize.',
            analogyTip: 'The student looks at the book page and drafts the answer.'
          }
        ],
        walkthroughExample: {
          query: 'What is our return window on open headphones?',
          context: 'Customer Service Policy Section 4.2: Open-box headphones may be returned within 14 calendar days of delivery for a full refund.',
          stepByStepTrace: [
            {
              step: 'Step 1: Ingestion',
              whatHappens: 'System indexed the customer manual into chunks.',
              output: 'Chunks indexed.'
            },
            {
              step: 'Step 2: User Query',
              whatHappens: 'User asks the return question.',
              output: 'Query received.'
            },
            {
              step: 'Step 3: Synthesis',
              whatHappens: 'AI writes answer from policy.',
              output: 'Answer generated.'
            }
          ],
          finalAnswer: 'You have 14 days to return opened headphones.'
        },
        knowledgeCheck: [
          {
            question: 'What is the main difference between standard AI and RAG?',
            options: [
              'RAG completely retrains the AI model on new data every second.',
              'RAG provides external reference notes right when the question is asked.',
              'RAG makes the AI faster by removing words.',
              'RAG only works with image generation.'
            ],
            correctIndex: 1,
            explanation: 'RAG acts like an open-book exam, retrieving real documents at query time rather than relying on frozen memory.'
          },
          {
            question: 'Why does RAG help prevent hallucinations?',
            options: [
              'It forces the AI to ground its answers in verified reference facts provided in the prompt.',
              'It erases all errors from the internet.',
              'It replaces the AI with a calculator.',
              'It prevents users from asking tricky questions.'
            ],
            correctIndex: 0,
            explanation: 'Because the AI is explicitly told: "Answer using only these verified snippets", it has the exact facts in front of it.'
          },
          {
            question: 'True or False: RAG permanently alters the internal weights of the neural network.',
            options: [
              'True — every search query permanently modifies the LLM brain.',
              'False — RAG does not retrain the model; it merely feeds fresh text into the context window.'
            ],
            correctIndex: 1,
            explanation: 'Crucial principle: RAG does NOT touch the model weights. It gives the AI an open notebook at runtime.'
          }
        ],
        summaryTakeaways: [
          'RAG = Retrieval + Augmented Generation.',
          'Solves hallucination and outdated knowledge.',
          'Never alters model weights.'
        ]
      },
      evaluation: {
        verdict: 'FAIL',
        passedCount: 4,
        totalCount: 6,
        evaluatorTimestamp: Date.now() - 3590000,
        rejectionSummary: 'Failed 2 hard checkpoints: NO_UNEXPLAINED_JARGON (used "vector embeddings" and "cosine similarity" without plain-English definitions) and TEACHES_BY_EXAMPLE (walkthrough trace lacked the concrete intermediate snippet retrieval step).',
        checkpoints: [
          {
            id: 'ACCURATE_AND_GROUNDED',
            title: 'Accurate & Grounded',
            dimension: 'Technical Fidelity & Conceptual Correctness',
            status: 'PASS',
            evidence: 'Correctly noted in knowledge check: "RAG does not retrain the model; it merely feeds fresh text into the context window."',
            critique: 'Technically sound. Avoided the false claim that RAG fine-tunes weights.',
            remedySuggestion: 'Maintain this factual distinction.'
          },
          {
            id: 'BEGINNER_FRIENDLY_LANGUAGE',
            title: 'Beginner-Friendly Language',
            dimension: 'Audience Empathy & Tone Accessibility',
            status: 'PASS',
            evidence: '"Imagine taking a difficult final exam relying solely on what you memorized months ago, versus taking the exact same exam with an open textbook..."',
            critique: 'The exam metaphor is intuitive and immediately bridges the concept to lived experience.',
            remedySuggestion: 'Keep the open-book metaphor prominent.'
          },
          {
            id: 'TEACHES_BY_EXAMPLE',
            title: 'Teaches by Example',
            dimension: 'Concrete Mental Models & Walkthrough Traces',
            status: 'FAIL',
            evidence: 'Walkthrough Trace Step 1: "System indexed the customer manual into chunks. Output: Chunks indexed."',
            critique: 'The walkthrough example is too compressed and generic. It does not show the exact text snippet being retrieved and how that specific snippet was handed over to the prompt with the question.',
            remedySuggestion: 'Explicitly show the actual raw text chunk retrieved from the customer policy and display the exact prompt passed to the AI before showing the final answer.'
          },
          {
            id: 'NO_UNEXPLAINED_JARGON',
            title: 'Clear, No Unexplained Jargon',
            dimension: 'Zero-Tolerance Terminology Scaffolding',
            status: 'FAIL',
            evidence: '"These paragraphs are converted into vector embeddings and saved in a vector database." and "performs a cosine similarity search across the vector space"',
            critique: 'Hard violation. The terms "vector embeddings", "vector database", and "cosine similarity search" are dropped into the text without first explaining what they mean in plain, beginner language.',
            remedySuggestion: 'Define embeddings immediately with a friendly metaphor (e.g. GPS coordinates for ideas) before ever using the word, or replace "cosine similarity search" with "meaning-matching search (finding chunks with similar coordinates)".'
          },
          {
            id: 'COVERS_KEY_POINTS',
            title: 'Covers Key Points',
            dimension: 'Curricular Completeness',
            status: 'PASS',
            evidence: 'Addresses What it is, Why it matters (hallucination/outdated data), and How it works (3 phases).',
            critique: 'All 3 fundamental pillars are represented.',
            remedySuggestion: 'Ensure explanations remain balanced.'
          },
          {
            id: 'COHERENT_TEACHING_FLOW',
            title: 'Coherent Teaching Flow',
            dimension: 'Pedagogical Narrative & Scaffolding',
            status: 'PASS',
            evidence: 'Hook -> Metaphor -> What & Why -> 3 Phases -> Walkthrough -> Quiz -> Summary.',
            critique: 'Logical progression from intuitive to applied.',
            remedySuggestion: 'Preserve this structure during revision.'
          }
        ]
      }
    },
    {
      iteration: 2,
      status: 'EVALUATED_PASSED',
      timestamp: Date.now() - 1800000,
      durationMs: 2510,
      criticFeedbackFedForward: '[VIOLATION #1] Checkpoint: Clear, No Unexplained Jargon\n- Flagged Evidence: "vector embeddings" and "cosine similarity search"\n- Auditor Critique: Jargon terms dropped without plain definitions.\n- Prescribed Remedy: Define embeddings as GPS coordinates for ideas before using the word.\n\n[VIOLATION #2] Checkpoint: Teaches by Example\n- Flagged Evidence: Walkthrough was too high-level.\n- Prescribed Remedy: Show the exact text chunk retrieved and the combined prompt.',
      promptUsed: 'Topic: "Introduction to RAG"\nSYSTEM DIRECTIVE: Previous iteration rejected. Surgically fix unexplained jargon and enrich walkthrough trace...',
      lesson: {
        topic: 'Introduction to RAG (Retrieval-Augmented Generation)',
        title: 'Introduction to RAG: Giving AI an Open-Book Exam',
        hook: 'Imagine sitting down for the most difficult exam of your life with only your memory. Now imagine the proctor hands you an organized library card catalog and an open textbook. That difference is RAG.',
        mentalModel: {
          title: 'The Closed-Book vs. Open-Book Exam',
          analogy: 'A regular AI model is like a student taking a closed-book exam. Its knowledge is permanently frozen on the day its training finished. It can be remarkably articulate, but if asked about something it never learned or forgot, it may guess wildly (hallucinate). RAG transforms that student into an open-book researcher: before answering any question, the AI retrieves relevant, verified document snippets and references them to formulate its answer.',
          takeaway: 'RAG doesn\'t rewrite the AI\'s brain; it places the exact right reference sheet in front of the AI at the moment it answers.'
        },
        whatItIs: 'RAG stands for Retrieval-Augmented Generation. In plain terms, it is a method where an AI system first fetches ("retrieves") verified reference facts from your external documents, and then uses those facts to write ("generate") a grounded, truthful response.',
        whyItMatters: {
          problemSolved: 'Standard AI models have two severe flaws: 1) Hallucination — they make up convincing but false facts when uncertain. 2) Frozen Knowledge — they know nothing about current news, internal company handbooks, or private customer records.',
          consequencesOfNotUsing: 'Without RAG, asking an AI "What is our company\'s paternity leave policy?" produces a confident guess that might misinform your employees. With RAG, the AI quotes the exact official HR handbook paragraph with zero guesswork.'
        },
        howItWorks: [
          {
            stepNumber: 1,
            title: 'Ingestion & Chunking: Chopping and Tagging Knowledge',
            explanation: 'Large documents (like a 200-page manual) are broken into bite-sized paragraphs called "chunks". Each chunk is converted into an "embedding" — think of an embedding simply as a set of GPS coordinates for meaning. Chunks with similar ideas (e.g. "dogs" and "puppies") receive coordinates close to one another, and are stored in a specialized filing cabinet called a vector database.',
            analogyTip: 'Like filing index cards into a library catalog by topic rather than random stacking.'
          },
          {
            stepNumber: 2,
            title: 'Retrieval: Finding the Closest Match',
            explanation: 'When a user asks a question, the system converts that question into the same GPS coordinate system. It searches the library catalog to find the 2 or 3 chunks whose coordinates are closest in meaning to the question. This is called semantic similarity search.',
            analogyTip: 'Like looking up "return policy" in the book index and turning directly to page 42.'
          },
          {
            stepNumber: 3,
            title: 'Augmented Generation: Answering from the Notes',
            explanation: 'The system takes the user question and the retrieved text chunks, pastes them together into a single prompt, and instructs the AI: "Answer the user\'s question using ONLY the provided reference notes." The AI synthesizes the answer with complete grounding.',
            analogyTip: 'The student reads the exact paragraph on page 42 and writes an accurate, citeable answer.'
          }
        ],
        walkthroughExample: {
          query: 'Can I return an opened box of Bluetooth headphones after 10 days?',
          context: 'Knowledge Base: Customer Return Policy, Section 4.2: "Audio gear and opened-box headphones are eligible for a 100% refund within 14 calendar days of delivery with receipt. Items beyond 14 days receive store credit."',
          stepByStepTrace: [
            {
              step: 'Step 1: User Query Ingestion',
              whatHappens: 'User asks: "Can I return opened headphones after 10 days?"',
              output: 'Question mapped to semantic meaning coordinates.'
            },
            {
              step: 'Step 2: Semantic Retrieval',
              whatHappens: 'Vector search scans 1,200 company policy chunks and identifies the top match: Section 4.2 on Audio Gear (14-day window).',
              output: 'Retrieved Chunk: "Audio gear and opened-box headphones are eligible for a 100% refund within 14 calendar days..."'
            },
            {
              step: 'Step 3: Prompt Augmentation',
              whatHappens: 'System bundles the prompt: "Context: Section 4.2 [...] Question: Can I return opened headphones after 10 days? Answer based solely on context."',
              output: 'Complete augmented prompt ready for the language model.'
            },
            {
              step: 'Step 4: Grounded Synthesis',
              whatHappens: 'The AI reads the 14-day rule, compares 10 days < 14 days, and drafts a clear, factual answer with cited policy.',
              output: 'Final answer generated without hallucination.'
            }
          ],
          finalAnswer: 'Yes, you can return them for a 100% full refund! According to Section 4.2 of the Customer Return Policy, opened-box headphones are eligible for return within 14 calendar days of delivery with receipt. Since you are at 10 days, you are comfortably within the window.'
        },
        knowledgeCheck: [
          {
            question: 'What does the "R" in RAG stand for, and what does it actually do?',
            options: [
              'Re-training: it rewrites the internal parameters of the AI model.',
              'Retrieval: it searches and fetches relevant document chunks before the AI writes an answer.',
              'Randomization: it scrambles the question to protect user privacy.',
              'Reduction: it deletes long words to make the AI run faster.'
            ],
            correctIndex: 1,
            explanation: 'R stands for Retrieval — finding the exact reference facts needed before generation begins.'
          },
          {
            question: 'How does this system avoid making up fake answers (hallucination)?',
            options: [
              'By giving the AI an open-book prompt containing the verified source paragraph to base its answer on.',
              'By making the AI read the entire internet every time someone asks a question.',
              'By turning off the AI\'s ability to use adjectives.',
              'By replacing the AI with a basic spreadsheet lookup.'
            ],
            correctIndex: 0,
            explanation: 'The AI doesn\'t have to guess from memory because the exact source fact is right in front of it in the prompt.'
          },
          {
            question: 'Does RAG permanently change or fine-tune the AI\'s neural network weights?',
            options: [
              'Yes, every document added permanently alters the model weights.',
              'No, RAG never modifies the model weights; it simply feeds relevant text into the context window at runtime.'
            ],
            correctIndex: 1,
            explanation: 'Crucial distinction: RAG is a runtime retrieval technique, not a model retraining process.'
          }
        ],
        summaryTakeaways: [
          'RAG = Retrieval-Augmented Generation (fetch facts first, then write the answer).',
          'Like an open-book exam: provides the exact reference notes at query time.',
          'Eliminates hallucinations and allows AI to answer from private, fresh documents without model retraining.'
        ]
      },
      evaluation: {
        verdict: 'PASS',
        passedCount: 6,
        totalCount: 6,
        evaluatorTimestamp: Date.now() - 1790000,
        checkpoints: [
          {
            id: 'ACCURATE_AND_GROUNDED',
            title: 'Accurate & Grounded',
            dimension: 'Technical Fidelity & Conceptual Correctness',
            status: 'PASS',
            evidence: '"Crucial distinction: RAG is a runtime retrieval technique, not a model retraining process... never modifies the model weights."',
            critique: 'Technically flawless. Clear, unambiguous explanation of how retrieval augments the prompt without model weight modification.',
            remedySuggestion: 'Maintain this standard.'
          },
          {
            id: 'BEGINNER_FRIENDLY_LANGUAGE',
            title: 'Beginner-Friendly Language',
            dimension: 'Audience Empathy & Tone Accessibility',
            status: 'PASS',
            evidence: '"Imagine sitting down for the most difficult exam of your life with only your memory. Now imagine the proctor hands you an organized library card catalog and an open textbook."',
            critique: 'Excellent emotional hook and everyday framing. Zero alienating academic jargon.',
            remedySuggestion: 'Maintain this tone.'
          },
          {
            id: 'TEACHES_BY_EXAMPLE',
            title: 'Teaches by Example',
            dimension: 'Concrete Mental Models & Walkthrough Traces',
            status: 'PASS',
            evidence: 'Detailed 4-step walkthrough tracing user question "Can I return opened headphones after 10 days?", showing the extracted Section 4.2 chunk, the bundled prompt, and grounded 10 < 14 day answer.',
            critique: 'Surgically resolved previous failure. Shows the complete end-to-end journey with real inputs and outputs.',
            remedySuggestion: 'Maintain full walkthrough traces.'
          },
          {
            id: 'NO_UNEXPLAINED_JARGON',
            title: 'Clear, No Unexplained Jargon',
            dimension: 'Zero-Tolerance Terminology Scaffolding',
            status: 'PASS',
            evidence: '"Each chunk is converted into an \'embedding\' — think of an embedding simply as a set of GPS coordinates for meaning... vector database like a specialized filing cabinet."',
            critique: 'Surgically resolved previous failure. Every single technical term (chunks, embeddings, vector database, semantic similarity search) is anchored immediately in everyday language.',
            remedySuggestion: 'Maintain GPS coordinates analogy.'
          },
          {
            id: 'COVERS_KEY_POINTS',
            title: 'Covers Key Points',
            dimension: 'Curricular Completeness',
            status: 'PASS',
            evidence: 'Completely covers What it is, Why it matters (hallucination & private data), and How it works (Ingestion -> Retrieval -> Generation).',
            critique: 'All curriculum requirements satisfied in depth.',
            remedySuggestion: 'Maintain tripartite structure.'
          },
          {
            id: 'COHERENT_TEACHING_FLOW',
            title: 'Coherent Teaching Flow',
            dimension: 'Pedagogical Narrative & Scaffolding',
            status: 'PASS',
            evidence: 'Seamless narrative flow from the exam hook to mechanical phases, into a 4-step trace, followed by a 3-question self-test.',
            critique: 'Outstanding pedagogical progression.',
            remedySuggestion: 'Preserve this scaffolding.'
          }
        ]
      }
    }
  ],
  rejectionLogs: [
    {
      iteration: 1,
      failedCheckpoints: ['Clear, No Unexplained Jargon', 'Teaches by Example'],
      violations: [
        {
          checkpointTitle: 'Clear, No Unexplained Jargon',
          quote: '"These paragraphs are converted into vector embeddings and saved in a vector database." and "performs a cosine similarity search across the vector space"',
          critique: 'Technical terms were introduced without plain-English definitions, violating the zero-tolerance jargon rule.',
          remedy: 'Define embeddings as "GPS coordinates for ideas" before using the term.'
        },
        {
          checkpointTitle: 'Teaches by Example',
          quote: 'Walkthrough Step 1: "System indexed the customer manual into chunks. Output: Chunks indexed."',
          critique: 'The practical trace was too abstract and skipped showing the actual retrieved document snippet.',
          remedy: 'Show the raw retrieved chunk (Section 4.2) and the exact bundled prompt before generating the final answer.'
        }
      ],
      remedyPromptInjected: 'Prescribed remedies: (1) Define embeddings as GPS coordinates for ideas before using the word. (2) Provide a complete 4-step concrete trace showing retrieved text snippet and prompt assembly.',
      diffSummary: 'Iteration 1 failed 2 checkpoints. Injected targeted terminology scaffolding and concrete query trace into Iteration 2. Iteration 2 passed all 6 checkpoints.'
    }
  ],
  shippedLesson: null as any, // populated in object below
  synthesizedRules: [
    {
      id: 'rule-learned-rag-trace',
      title: 'Full Trace Transparency for Walkthroughs',
      category: 'PEDAGOGY',
      ruleText: 'Never summarize the walkthrough step as "chunks indexed". Always show the specific text snippet fetched from the reference manual and how it was appended to the prompt.',
      originTopic: 'Introduction to RAG',
      learnedFromIteration: 1,
      createdAt: '2026-11-07T03:30:00.000Z',
      active: true,
      timesApplied: 1,
    }
  ]
};

SAMPLE_RAG_RUN.shippedLesson = SAMPLE_RAG_RUN.iterations[1].lesson;
