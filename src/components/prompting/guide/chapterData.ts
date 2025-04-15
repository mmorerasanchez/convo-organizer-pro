
import { type Chapter } from './types';
import React from 'react';

export const chapters: Chapter[] = [
    {
      title: "Introduction to Prompt Engineering",
      description: "Understanding the basics of prompts and their evolution",
      slides: [
        {
          title: "What Is a Prompt?",
          content: (
            <div className="space-y-3">
              <p>
                A prompt is the input text you provide to an AI model to guide it in generating the desired output. 
                Think of it as a script or instruction that tells the model what to do. Prompts can be as simple 
                as a single sentence or as complex as a multi-part directive filled with examples and formatting instructions.
              </p>
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">Basic Example:</p>
                <p>Prompt: "The sky is"</p>
                <p>Output: "blue."</p>
                <p className="text-sm text-muted-foreground mt-2">
                  This illustrates how even simple prompts can elicit meaningful responses.
                </p>
              </div>
            </div>
          )
        },
        {
          title: "Historical Context and Evolution",
          content: (
            <div className="space-y-3">
              <p>
                Originally, AI systems were constrained by rule-based interactions. With the advent of large 
                language models, prompt engineering has evolved into a critical skill that determines how well 
                an LM can perform tasks—both mundane and complex.
              </p>
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">Evolution Highlights:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Rule-based systems gave way to flexible LMs that adapt to textual inputs.</li>
                  <li>Small prompt changes were found to yield drastically different outputs.</li>
                  <li>Development of systematic techniques like zero-shot, few-shot, and chain-of-thought.</li>
                  <li>Advanced strategies like ReAct emerged for complex reasoning tasks.</li>
                </ul>
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: "Core Components of an Effective Prompt",
      description: "Understanding the key elements that make up a good prompt",
      slides: [
        {
          title: "Instruction",
          content: (
            <div className="space-y-3">
              <p>
                The instruction is the command or directive specifying what you want the AI to do. 
                Clarity and directness are critical.
              </p>
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">Examples of Instructions:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>"Summarize the following article in one sentence."</li>
                  <li>"Translate this text to French."</li>
                  <li>"Write a Python script that greets the user."</li>
                </ul>
              </div>
            </div>
          )
        },
        {
          title: "Context",
          content: (
            <div className="space-y-3">
              <p>
                Providing context means supplying any additional information that helps the AI understand 
                the task better—this may include the purpose, audience, background details, or constraints 
                on style and length.
              </p>
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">Why Context Matters:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>It focuses the output on what truly matters</li>
                  <li>It can reduce ambiguous or generic responses</li>
                  <li>Helps maintain consistency across multiple prompts</li>
                </ul>
              </div>
            </div>
          )
        },
        {
          title: "Input Data",
          content: (
            <div className="space-y-3">
              <p>
                This is the data or text that the AI should operate on. In many tasks (e.g., summarization, 
                translation, classification), you provide the text or other data to be processed.
              </p>
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">Best Practices:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Clearly separate input data from instructions</li>
                  <li>Format data in a way that's easy for the model to process</li>
                  <li>Consider using delimiters (triple quotes, brackets, etc.) for clarity</li>
                </ul>
              </div>
            </div>
          )
        },
        {
          title: "Output Indicator",
          content: (
            <div className="space-y-3">
              <p>
                An output indicator tells the model what format or style the answer should take 
                (e.g., bullet points, JSON, code snippet, short paragraph).
              </p>
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">Example:</p>
                <p>"Produce the answer in valid JSON format."</p>
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: "Prompting Techniques",
      description: "Various methods to improve the effectiveness of your prompts",
      slides: [
        {
          title: "Zero-Shot Prompting",
          content: (
            <div className="space-y-3">
              <p>
                Zero-shot prompting involves asking the model to perform a task without providing any examples. 
                The instruction is all that's given, relying on the model's pre-existing knowledge.
              </p>
              <div className="bg-muted p-3 rounded-md space-y-2">
                <div>
                  <p className="font-medium">When to Use:</p>
                  <p>For straightforward tasks where the model's training data already covers the topic.</p>
                </div>
                <div>
                  <p className="font-medium">Benefits:</p>
                  <p>Simplicity and speed of implementation.</p>
                </div>
              </div>
            </div>
          )
        },
        {
          title: "Few-Shot Prompting",
          content: (
            <div className="space-y-3">
              <p>
                Few-shot prompting includes a handful of examples within the prompt. These examples illustrate 
                the desired behavior, helping the model to generalize from them.
              </p>
              <div className="bg-muted p-3 rounded-md space-y-2">
                <div>
                  <p className="font-medium">How It Works:</p>
                  <p>
                    You supply one or more input–output pairs before the actual task, which guides the model 
                    toward the correct output format.
                  </p>
                </div>
                <div>
                  <p className="font-medium">Benefits:</p>
                  <p>Improved accuracy for more complex tasks and when the expected output format is specific.</p>
                </div>
              </div>
            </div>
          )
        },
        {
          title: "Chain-of-Thought (CoT) Prompting",
          content: (
            <div className="space-y-3">
              <p>
                Chain-of-thought prompting encourages the model to think through a problem step by step before 
                arriving at a final answer.
              </p>
              <div className="bg-muted p-3 rounded-md space-y-2">
                <div>
                  <p className="font-medium">Application:</p>
                  <p>Particularly effective in reasoning and arithmetic problems.</p>
                </div>
                <div>
                  <p className="font-medium">Example:</p>
                  <p>"Let's think step by step" may be prefixed to the prompt to trigger intermediate reasoning steps.</p>
                </div>
              </div>
            </div>
          )
        },
        {
          title: "Role and Context-Based Prompting",
          content: (
            <div className="space-y-3">
              <p>
                Defining the role or persona of the AI can help steer its responses. For example, setting the role 
                as "a technical expert" versus "a friendly advisor" can significantly change the tone and depth of the response.
              </p>
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">Example:</p>
                <p>
                  "You are a professional customer service agent. Answer the following question clearly and concisely."
                </p>
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: "Best Practices in Prompt Design",
      description: "Guidelines for crafting effective prompts",
      slides: [
        {
          title: "Start Simple and Iterate",
          content: (
            <div className="space-y-3">
              <p>
                Begin with a simple prompt and gradually increase its complexity by adding necessary context or examples. 
                This iterative process helps identify which elements most influence the model's performance.
              </p>
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">Tip:</p>
                <p>
                  Experiment with different variations and record the outputs to determine which approach yields the best results.
                </p>
              </div>
            </div>
          )
        },
        {
          title: "Be Specific and Concise",
          content: (
            <div className="space-y-3">
              <p>
                Clarity is key. Avoid ambiguous or overly complex language. Instead, focus on clear and direct 
                instructions that leave little room for misinterpretation.
              </p>
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">Advice:</p>
                <p>
                  Instead of saying "Write something about AI," specify "Write a 200-word summary on the impact of AI in healthcare."
                </p>
              </div>
            </div>
          )
        },
        {
          title: "Provide Relevant Examples",
          content: (
            <div className="space-y-3">
              <p>
                When using few-shot prompting, choose examples that are as close as possible to the task at hand. 
                This helps reduce confusion and guides the model toward producing consistent outputs.
              </p>
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">Best Practice:</p>
                <p>
                  Use consistent formatting in your examples so that the pattern is unmistakable.
                </p>
              </div>
            </div>
          )
        },
        {
          title: "Avoid Negative Instructions",
          content: (
            <div className="space-y-3">
              <p>
                Rather than telling the model what not to do, focus on instructing it on what should be done. 
                Negative instructions (e.g., "Do not ask for personal information") can sometimes be ignored. 
                Instead, frame your prompt with positive instructions.
              </p>
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">Example Improvement:</p>
                <p>
                  "Provide a list of trending movies without referencing personal data" is clearer than a list of prohibitions.
                </p>
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: "Domain-Specific Prompt Engineering",
      description: "Tailored approaches for different types of tasks",
      slides: [
        {
          title: "Text Summarization",
          content: (
            <div className="space-y-3">
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">Prompt:</p>
                <p>
                  "Summarize the following paragraph into one concise sentence.
                  [Insert lengthy paragraph here]"
                </p>
                <p className="font-medium mt-2">Expected Output:</p>
                <p>
                  A one-sentence summary that captures the main idea.
                </p>
              </div>
            </div>
          )
        },
        {
          title: "Code Generation",
          content: (
            <div className="space-y-3">
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">Prompt:</p>
                <p>
                  "Write a JavaScript function that takes an array of numbers and returns a new array with each number doubled.
                  Include comments to explain the code."
                </p>
                <p className="font-medium mt-2">Expected Output:</p>
                <p>
                  A commented JavaScript function that iterates over the array and doubles each value.
                </p>
              </div>
            </div>
          )
        },
        {
          title: "Conversational AI",
          content: (
            <div className="space-y-3">
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">Prompt:</p>
                <p>
                  "You are a friendly travel advisor. Answer the following question in a warm, welcoming tone:
                  'What are some must-see attractions in Paris?'"
                </p>
                <p className="font-medium mt-2">Expected Output:</p>
                <p>
                  A list of popular Paris attractions written in a conversational, inviting style.
                </p>
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: "Practical Tips and Takeaways",
      description: "Final advice for effective prompt engineering",
      slides: [
        {
          title: "Key Takeaways",
          content: (
            <div className="space-y-3">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-medium">Experiment Boldly:</span> Don't be afraid to try new structures or instructions. 
                  The most effective prompts often come from iterative experimentation.
                </li>
                <li>
                  <span className="font-medium">Document Your Findings:</span> Keep track of prompt variations and outcomes. 
                  This documentation can be invaluable for refining techniques over time.
                </li>
                <li>
                  <span className="font-medium">Stay Updated:</span> Follow the latest research and community developments, 
                  as prompt engineering is a fast-moving field.
                </li>
                <li>
                  <span className="font-medium">Focus on Clarity:</span> Always aim for clear, unambiguous language in your prompts. 
                  The simpler and more direct the instruction, the better the model's performance.
                </li>
                <li>
                  <span className="font-medium">Design for Specificity:</span> Tailor your prompt to the task at hand. 
                  The more the prompt aligns with the intended outcome, the more reliably the model will respond in the desired manner.
                </li>
              </ul>
            </div>
          )
        }
      ]
    }
  ];
