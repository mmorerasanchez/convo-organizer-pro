
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

// Define the structure for our guide content
interface Slide {
  title: string;
  content: React.ReactNode;
}

interface Chapter {
  title: string;
  description: string;
  slides: Slide[];
}

const PromptingGuide = () => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Define the comprehensive guide content
  const chapters: Chapter[] = [
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
                Think of it as the script or instruction that tells the model what to do. Prompts can be as simple 
                as a single word or sentence, or as complex as a multi-part instruction with embedded examples.
              </p>
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">Basic Example:</p>
                <p>Prompt: "The sky is"</p>
                <p>Output: "blue."</p>
                <p className="text-sm text-muted-foreground mt-2">
                  This illustrates the basic idea: a minimal prompt leads to a continuation based on the model's training.
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
                Originally, AI systems were limited to rigid, rule-based interactions. With the advent of large 
                language models, prompt engineering has evolved into a critical skill, influencing how well an LM 
                can understand and perform tasks. Researchers and developers now experiment with different prompting 
                techniques to improve performance, safety, and specificity across a wide range of applications.
              </p>
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">Evolution:</p>
                <p>
                  Early experiments showed that small changes in prompt wording could yield vastly different outputs, 
                  leading to the development of systematic techniques such as zero-shot, few-shot, and chain-of-thought prompting.
                </p>
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
                The instruction is the command or directive that specifies what you want the AI to do. It should be clear and direct.
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
                Providing context means including additional information that helps the AI understand the task better. 
                This can include background details, the purpose of the prompt, or even the style in which the output should be generated.
              </p>
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">Why Context Matters:</p>
                <p>
                  Context sets boundaries and clarifies ambiguous instructions. For example, asking "Explain antibiotics" 
                  might lead to a generic answer, whereas adding "Explain antibiotics for a high school biology student in 
                  two sentences" refines the expected output.
                </p>
              </div>
            </div>
          )
        },
        {
          title: "Input Data",
          content: (
            <div className="space-y-3">
              <p>
                This is the actual content or data that the AI needs to work on. In many prompts, especially those for 
                summarization or extraction tasks, you'll provide a block of text or data.
              </p>
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">Example:</p>
                <p>
                  In a summarization task, the input might be a long article or paragraph that you want to be condensed.
                </p>
              </div>
            </div>
          )
        },
        {
          title: "Output Indicator",
          content: (
            <div className="space-y-3">
              <p>
                An output indicator tells the model what form the answer should take. This might include formatting 
                instructions (e.g., "Provide a list in bullet points") or specify the desired output length or style.
              </p>
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">Example:</p>
                <p>"List the steps in a numbered format."</p>
              </div>
            </div>
          )
        },
        {
          title: "Prompt Structure and Formatting",
          content: (
            <div className="space-y-3">
              <p>
                Formatting can be crucial for effective prompt delivery. Different tasks benefit from distinct structures:
              </p>
              <div className="bg-muted p-3 rounded-md space-y-2">
                <div>
                  <p className="font-medium">Question/Answer (QA) Format:</p>
                  <p>Use labels like "Q:" and "A:" to clearly delineate the inquiry and expected response.</p>
                </div>
                <div>
                  <p className="font-medium">Role-Based Prompts:</p>
                  <p>Define roles to shape behavior. For example, "You are an AI research assistant…" sets the tone and expectations.</p>
                </div>
                <div>
                  <p className="font-medium">Separator Usage:</p>
                  <p>Use clear delimiters (e.g., "###") to separate instructions, context, and input data.</p>
                </div>
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
        },
        {
          title: "Advanced Prompting for Domain-Specific Tasks",
          content: (
            <div className="space-y-3">
              <p>
                Some tasks, such as code generation or text-to-image creation, require specialized prompting strategies:
              </p>
              <div className="bg-muted p-3 rounded-md space-y-2">
                <div>
                  <p className="font-medium">Code Generation:</p>
                  <p>Include code comments and structure the prompt as a code block.</p>
                </div>
                <div>
                  <p className="font-medium">Text-to-Image:</p>
                  <p>Describe visual elements (subject, style, lighting) in a succinct and descriptive manner.</p>
                </div>
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
        },
        {
          title: "Optimize Prompt Length",
          content: (
            <div className="space-y-3">
              <p>
                Longer prompts can provide more context and lead to better outputs, but they must remain relevant. 
                Avoid adding unnecessary details that do not contribute to the task.
              </p>
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">Consideration:</p>
                <p>
                  Always balance the amount of context with clarity to avoid overwhelming the model.
                </p>
              </div>
            </div>
          )
        },
        {
          title: "Test Across Different Models and Use Cases",
          content: (
            <div className="space-y-3">
              <p>
                Different language models might interpret the same prompt differently. Regularly test your prompts 
                across various platforms and for multiple scenarios to ensure robustness.
              </p>
            </div>
          )
        }
      ]
    },
    {
      title: "Practical Examples Across Tasks",
      description: "Real-world examples of effective prompts for different purposes",
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
          title: "Information Extraction",
          content: (
            <div className="space-y-3">
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">Prompt:</p>
                <p>
                  "Extract the names of all the organizations mentioned in the following text:
                  'The research was conducted at the Champalimaud Centre for the Unknown in Lisbon and sponsored by Global Health Inc.'
                  Output in the format: Organization: [name1, name2]"
                </p>
                <p className="font-medium mt-2">Expected Output:</p>
                <p>
                  "Organization: [Champalimaud Centre for the Unknown, Global Health Inc.]"
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
          title: "Chain-of-Thought Reasoning",
          content: (
            <div className="space-y-3">
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">Prompt:</p>
                <p>
                  "What is the product of 23 and 47?
                  Let's think through this step by step."
                </p>
                <p className="font-medium mt-2">Expected Output:</p>
                <p>
                  A breakdown that might include:
                </p>
                <ul className="list-disc pl-5">
                  <li>Multiply 20 by 47</li>
                  <li>Multiply 3 by 47</li>
                  <li>Sum the two results to arrive at the final answer</li>
                </ul>
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

  // Calculate total slides for chapter
  const totalSlides = chapters[currentChapter].slides.length;

  // Navigation functions
  const goToPreviousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToNextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    } else if (currentChapter < chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
      setCurrentSlide(0);
    }
  };

  const goToPreviousChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
      setCurrentSlide(0);
    }
  };

  const goToNextChapter = () => {
    if (currentChapter < chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
      setCurrentSlide(0);
    }
  };

  // Get current content
  const currentChapterData = chapters[currentChapter];
  const currentSlideData = currentChapterData.slides[currentSlide];

  return (
    <div className="space-y-4">
      {/* Chapter selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chapters.map((chapter, index) => (
          <Card 
            key={index}
            className={`cursor-pointer hover:bg-muted/50 transition-colors ${
              currentChapter === index ? 'border-primary' : ''
            }`}
            onClick={() => {
              setCurrentChapter(index);
              setCurrentSlide(0);
            }}
          >
            <CardHeader className="py-3">
              <CardTitle className="text-lg">{chapter.title}</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <p className="text-sm text-muted-foreground">{chapter.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current slide content */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">
                Chapter {currentChapter + 1} · Slide {currentSlide + 1} of {totalSlides}
              </div>
              <CardTitle className="mt-1">{currentSlideData.title}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentSlideData.content}
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={goToPreviousChapter}
              disabled={currentChapter === 0}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={goToPreviousSlide}
              disabled={currentChapter === 0 && currentSlide === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={goToNextSlide}
              disabled={currentChapter === chapters.length - 1 && currentSlide === totalSlides - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={goToNextChapter}
              disabled={currentChapter === chapters.length - 1}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PromptingGuide;
