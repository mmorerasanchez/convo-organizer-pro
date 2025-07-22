import { type Chapter } from './types';

export const chapters: Chapter[] = [
    {
      id: "chapter-1",
      title: "Welcome to Lovable",
      description: "Your essential guide to harnessing the power of AI for product development",
      slides: [
        {
          id: "slide-1-1",
          title: "Welcome to Lovable",
          content: `
            Welcome to the Lovable AI Development Playbook, your essential guide to harnessing the power of artificial intelligence to create exceptional products. In this chapter, we'll introduce you to Lovable, an innovative platform designed to transform your product development process, enabling you to build sophisticated AI-powered applications with unprecedented speed and efficiency.
            
            ## What You'll Learn
            
            - What makes Lovable unique in the development landscape
            - Core capabilities that empower you to bring ideas to life
            - How to build applications without extensive coding knowledge
            - The revolutionary approach to AI-powered development
          `
        },
        {
          id: "slide-1-2",
          title: "What is Lovable?",
          content: `
            Lovable is more than just a development platform; it's a revolutionary AI-powered solution that empowers users to create full-stack web applications without writing a single line of code. Imagine describing your desired application in plain English and watching it materialize before your eyes.
            
            ## Key Features
            
            - **Natural Language Interface**: Describe your vision in plain English
            - **All-in-One Solution**: Everything you need in a single browser tab
            - **Streamlined Workflow**: From concept to deployment seamlessly
            - **Accessibility First**: Designed for innovators, entrepreneurs, and designers
            
            This intuitive approach significantly lowers the barrier to entry, allowing you to build complex applications that would traditionally require a team of seasoned developers.
          `
        },
        {
          id: "slide-1-3",
          title: "AI-Powered Platform",
          content: `
            At its heart, Lovable leverages advanced AI to interpret your descriptions and generate functional code. This means you can articulate your vision, and the platform handles the intricate details of programming, database management, and UI design.
            
            ## How It Works
            
            - **Vision Interpretation**: AI understands your requirements
            - **Code Generation**: Automatic creation of functional applications
            - **UI Design**: Crafting stunning user interfaces automatically
            - **Backend Logic**: Managing complex server-side operations
            - **Real-time Sync**: Handling data synchronization across users
            
            Lovable acts as your intelligent co-pilot, guiding you through every step of the creation process.
          `
        },
        {
          id: "slide-1-4",
          title: "Why Choose Lovable?",
          content: `
            In today's fast-paced digital landscape, speed, efficiency, and accessibility are paramount. Lovable addresses these needs directly, offering compelling advantages over traditional development methods.
            
            ## Perfect For
            
            - **Seasoned Developers**: Looking to accelerate their workflow
            - **Non-Technical Founders**: Aiming to launch their first product
            - **Product Managers**: Who want to prototype quickly
            - **Designers**: Who want to bring concepts to life
            
            Whether you're building your first application or your hundredth, Lovable provides the tools and capabilities to achieve your goals effectively.
          `
        },
        {
          id: "slide-1-5",
          title: "Speed & Efficiency",
          content: `
            Lovable dramatically accelerates the development lifecycle, allowing you to transform abstract ideas into high-quality user interfaces and fully functional applications at an unprecedented pace.
            
            ## Benefits
            
            - **Rapid Prototyping**: Turn ideas into working prototypes in minutes
            - **Quick Iteration**: Test concepts and gather feedback faster
            - **Faster Time-to-Market**: Bring products to market much quicker
            - **Enjoyable Process**: Less complexity, more creativity
            
            ## Traditional vs. Lovable
            
            - **Traditional**: Weeks or months of development
            - **Lovable**: Hours or days from concept to deployment
            
            This rapid development capability means you can iterate quickly, test concepts, and bring products to market much faster than ever before.
          `
        },
        {
          id: "slide-1-6",
          title: "No-Code Empowerment",
          content: `
            One of Lovable's most significant advantages is its commitment to no-code empowerment. You can build sophisticated AI products and complex web applications without needing to write any programming code.
            
            ## What's Eliminated
            
            - **Backend Logic Management**: No need to handle server complexities
            - **Token Management**: AI handles authentication automatically
            - **API Query Handling**: Seamless data integration
            - **Database Setup**: Automatic database configuration
            
            ## What's Enabled
            
            - **Focus on Ideas**: Spend time on what matters most
            - **Broader Audience**: Open to non-programmers
            - **Faster Learning**: No need to master programming languages
            
            This removes technical barriers, opening up product development to a much broader audience.
          `
        },
        {
          id: "slide-1-7",
          title: "Core Capabilities",
          content: `
            Lovable is designed to be a comprehensive solution for modern web application development. Its core capabilities span the entire spectrum of building and deploying applications, ensuring you have all the necessary tools within a unified environment.
            
            ## Complete Development Suite
            
            - **Frontend Development**: Beautiful, responsive user interfaces
            - **Backend Services**: Robust server-side functionality
            - **Database Management**: Efficient data storage and retrieval
            - **Real-time Features**: Live updates and collaboration
            - **Deployment Tools**: One-click publishing to the web
            
            ## Unified Environment
            
            Everything you need is integrated into a single platform, eliminating the need to juggle multiple tools and services.
          `
        },
        {
          id: "slide-1-8",
          title: "Full-Stack Development",
          content: `
            With Lovable, you're not just building front-end websites; you're creating complete, full-stack web applications. This comprehensive approach ensures your applications are production-ready and scalable.
            
            ## What You Can Build
            
            - **Dynamic Web Applications**: Interactive and responsive
            - **Real-time Collaboration Tools**: Multi-user experiences
            - **Data-Driven Dashboards**: Analytics and reporting
            - **AI-Powered Features**: Intelligent automation
            - **Mobile-Responsive Sites**: Works on all devices
            
            ## Your AI Co-Pilot
            
            The AI assistant functions as your constant co-pilot, providing intelligent suggestions and automating complex tasks, ensuring a smooth and efficient development experience from concept to deployment.
            
            **Ready to start building?** Let's dive into the next chapter and begin creating your first application!
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
