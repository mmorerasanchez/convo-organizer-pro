
import { type Chapter } from './types';

export const chapters: Chapter[] = [
    {
      id: "chapter-1",
      title: "Introduction to Prompt Engineering",
      description: "Understanding the basics of prompts and their evolution",
      slides: [
        {
          id: "slide-1-1",
          title: "What Is a Prompt?",
          content: `
            A prompt is the input text you provide to an AI model to guide it in generating the desired output. 
            Think of it as a script or instruction that tells the model what to do. Prompts can be as simple 
            as a single sentence or as complex as a multi-part directive filled with examples and formatting instructions.
            
            ## Basic Example
            
            Prompt: "The sky is"
            Output: "blue."
            
            This illustrates how even simple prompts can elicit meaningful responses.
          `
        },
        {
          id: "slide-1-2",
          title: "Historical Context and Evolution",
          content: `
            Originally, AI systems were constrained by rule-based interactions. With the advent of large 
            language models, prompt engineering has evolved into a critical skill that determines how well 
            an LM can perform tasks—both mundane and complex.
            
            ## Evolution Highlights
            
            - Rule-based systems gave way to flexible LMs that adapt to textual inputs.
            - Small prompt changes were found to yield drastically different outputs.
            - Development of systematic techniques like zero-shot, few-shot, and chain-of-thought.
            - Advanced strategies like ReAct emerged for complex reasoning tasks.
          `
        }
      ]
    },
    {
      id: "chapter-2",
      title: "Core Components of an Effective Prompt",
      description: "Understanding the key elements that make up a good prompt",
      slides: [
        {
          id: "slide-2-1",
          title: "Instruction",
          content: `
            The instruction is the command or directive specifying what you want the AI to do. 
            Clarity and directness are critical.
            
            ## Examples of Instructions
            
            - "Summarize the following article in one sentence."
            - "Translate this text to French."
            - "Write a Python script that greets the user."
          `
        },
        {
          id: "slide-2-2",
          title: "Context",
          content: `
            Providing context means supplying any additional information that helps the AI understand 
            the task better—this may include the purpose, audience, background details, or constraints 
            on style and length.
            
            ## Why Context Matters
            
            - It focuses the output on what truly matters
            - It can reduce ambiguous or generic responses
            - Helps maintain consistency across multiple prompts
          `
        },
        {
          id: "slide-2-3",
          title: "Input Data",
          content: `
            This is the data or text that the AI should operate on. In many tasks (e.g., summarization, 
            translation, classification), you provide the text or other data to be processed.
            
            ## Best Practices
            
            - Clearly separate input data from instructions
            - Format data in a way that's easy for the model to process
            - Consider using delimiters (triple quotes, brackets, etc.) for clarity
          `
        },
        {
          id: "slide-2-4",
          title: "Output Indicator",
          content: `
            An output indicator tells the model what format or style the answer should take 
            (e.g., bullet points, JSON, code snippet, short paragraph).
            
            ## Example
            
            "Produce the answer in valid JSON format."
          `
        }
      ]
    },
    {
      id: "chapter-3",
      title: "Prompting Techniques",
      description: "Various methods to improve the effectiveness of your prompts",
      slides: [
        {
          id: "slide-3-1",
          title: "Zero-Shot Prompting",
          content: `
            Zero-shot prompting involves asking the model to perform a task without providing any examples. 
            The instruction is all that's given, relying on the model's pre-existing knowledge.
            
            ## When to Use
            
            For straightforward tasks where the model's training data already covers the topic.
            
            ## Benefits
            
            Simplicity and speed of implementation.
          `
        },
        {
          id: "slide-3-2",
          title: "Few-Shot Prompting",
          content: `
            Few-shot prompting includes a handful of examples within the prompt. These examples illustrate 
            the desired behavior, helping the model to generalize from them.
            
            ## How It Works
            
            You supply one or more input–output pairs before the actual task, which guides the model 
            toward the correct output format.
            
            ## Benefits
            
            Improved accuracy for more complex tasks and when the expected output format is specific.
          `
        },
        {
          id: "slide-3-3",
          title: "Chain-of-Thought (CoT) Prompting",
          content: `
            Chain-of-thought prompting encourages the model to think through a problem step by step before 
            arriving at a final answer.
            
            ## Application
            
            Particularly effective in reasoning and arithmetic problems.
            
            ## Example
            
            "Let's think step by step" may be prefixed to the prompt to trigger intermediate reasoning steps.
          `
        },
        {
          id: "slide-3-4",
          title: "Role and Context-Based Prompting",
          content: `
            Defining the role or persona of the AI can help steer its responses. For example, setting the role 
            as "a technical expert" versus "a friendly advisor" can significantly change the tone and depth of the response.
            
            ## Example
            
            "You are a professional customer service agent. Answer the following question clearly and concisely."
          `
        }
      ]
    },
    {
      id: "chapter-4",
      title: "Best Practices in Prompt Design",
      description: "Guidelines for crafting effective prompts",
      slides: [
        {
          id: "slide-4-1",
          title: "Start Simple and Iterate",
          content: `
            Begin with a simple prompt and gradually increase its complexity by adding necessary context or examples. 
            This iterative process helps identify which elements most influence the model's performance.
            
            ## Tip
            
            Experiment with different variations and record the outputs to determine which approach yields the best results.
          `
        },
        {
          id: "slide-4-2",
          title: "Be Specific and Concise",
          content: `
            Clarity is key. Avoid ambiguous or overly complex language. Instead, focus on clear and direct 
            instructions that leave little room for misinterpretation.
            
            ## Advice
            
            Instead of saying "Write something about AI," specify "Write a 200-word summary on the impact of AI in healthcare."
          `
        },
        {
          id: "slide-4-3",
          title: "Provide Relevant Examples",
          content: `
            When using few-shot prompting, choose examples that are as close as possible to the task at hand. 
            This helps reduce confusion and guides the model toward producing consistent outputs.
            
            ## Best Practice
            
            Use consistent formatting in your examples so that the pattern is unmistakable.
          `
        },
        {
          id: "slide-4-4",
          title: "Avoid Negative Instructions",
          content: `
            Rather than telling the model what not to do, focus on instructing it on what should be done. 
            Negative instructions (e.g., "Do not ask for personal information") can sometimes be ignored. 
            Instead, frame your prompt with positive instructions.
            
            ## Example Improvement
            
            "Provide a list of trending movies without referencing personal data" is clearer than a list of prohibitions.
          `
        }
      ]
    },
    {
      id: "chapter-5",
      title: "Domain-Specific Prompt Engineering",
      description: "Tailored approaches for different types of tasks",
      slides: [
        {
          id: "slide-5-1",
          title: "Text Summarization",
          content: `
            ## Prompt
            
            "Summarize the following paragraph into one concise sentence.
            [Insert lengthy paragraph here]"
            
            ## Expected Output
            
            A one-sentence summary that captures the main idea.
          `
        },
        {
          id: "slide-5-2",
          title: "Code Generation",
          content: `
            ## Prompt
            
            "Write a JavaScript function that takes an array of numbers and returns a new array with each number doubled.
            Include comments to explain the code."
            
            ## Expected Output
            
            A commented JavaScript function that iterates over the array and doubles each value.
          `
        },
        {
          id: "slide-5-3",
          title: "Conversational AI",
          content: `
            ## Prompt
            
            "You are a friendly travel advisor. Answer the following question in a warm, welcoming tone:
            'What are some must-see attractions in Paris?'"
            
            ## Expected Output
            
            A list of popular Paris attractions written in a conversational, inviting style.
          `
        }
      ]
    },
    {
      id: "chapter-6",
      title: "Practical Tips and Takeaways",
      description: "Final advice for effective prompt engineering",
      slides: [
        {
          id: "slide-6-1",
          title: "Key Takeaways",
          content: `
            - **Experiment Boldly:** Don't be afraid to try new structures or instructions. The most effective prompts often come from iterative experimentation.
            
            - **Document Your Findings:** Keep track of prompt variations and outcomes. This documentation can be invaluable for refining techniques over time.
            
            - **Stay Updated:** Follow the latest research and community developments, as prompt engineering is a fast-moving field.
            
            - **Focus on Clarity:** Always aim for clear, unambiguous language in your prompts. The simpler and more direct the instruction, the better the model's performance.
            
            - **Design for Specificity:** Tailor your prompt to the task at hand. The more the prompt aligns with the intended outcome, the more reliably the model will respond in the desired manner.
          `
        }
      ]
    }
  ];
