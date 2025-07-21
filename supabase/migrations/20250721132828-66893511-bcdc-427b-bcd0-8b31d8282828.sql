
-- Add system prompts storage
CREATE TABLE system_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  version text NOT NULL,
  prompt_text text NOT NULL,
  framework_type text NOT NULL CHECK (framework_type IN ('scanner', 'designer')),
  active boolean DEFAULT false,
  performance_score numeric,
  usage_count integer DEFAULT 0,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Add RLS policies for system prompts
ALTER TABLE system_prompts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active system prompts
CREATE POLICY "Allow public read access to active system prompts" 
  ON system_prompts 
  FOR SELECT 
  USING (active = true);

-- Add framework type classification to existing frameworks table
ALTER TABLE frameworks ADD COLUMN framework_type text DEFAULT 'zero-shot' CHECK (framework_type IN ('zero-shot', 'few-shot'));

-- Add examples table for few-shot frameworks
CREATE TABLE framework_examples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  framework_id uuid REFERENCES frameworks(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  ordinal integer NOT NULL,
  created_at timestamp DEFAULT now()
);

-- Add RLS policies for framework examples
ALTER TABLE framework_examples ENABLE ROW LEVEL SECURITY;

-- Allow public read access to framework examples
CREATE POLICY "Allow public read access to framework examples" 
  ON framework_examples 
  FOR SELECT 
  USING (true);

-- Add prompt analytics table
CREATE TABLE prompt_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_type text NOT NULL CHECK (prompt_type IN ('scanner', 'designer')),
  framework_id uuid REFERENCES frameworks(id),
  system_prompt_id uuid REFERENCES system_prompts(id),
  success_rating integer CHECK (success_rating >= 1 AND success_rating <= 10),
  first_prompt_success boolean DEFAULT false,
  iteration_count integer DEFAULT 1,
  time_to_completion_ms integer,
  user_feedback text,
  prompt_content text,
  response_content text,
  created_at timestamp DEFAULT now()
);

-- Add RLS policies for prompt analytics
ALTER TABLE prompt_analytics ENABLE ROW LEVEL SECURITY;

-- Users can insert their own analytics
CREATE POLICY "Users can insert their own prompt analytics" 
  ON prompt_analytics 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own analytics
CREATE POLICY "Users can view their own prompt analytics" 
  ON prompt_analytics 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Insert new frameworks
INSERT INTO frameworks (name, description, framework_type) VALUES
('TAG (Task-Action-Goal)', 'Action-oriented framework for rapid prototyping and immediate development outcomes', 'zero-shot'),
('PAR (Problem-Analysis-Response)', 'Deep problem-solving methodology with multi-dimensional analysis', 'few-shot'),
('STAR (Situation-Task-Action-Result)', 'Scenario-based development with specific business contexts and measurable outcomes', 'few-shot');

-- Add framework fields for new frameworks
INSERT INTO framework_fields (framework_id, label, ordinal, help_text)
SELECT 
  f.id,
  field.label,
  field.ordinal,
  field.help_text
FROM frameworks f
CROSS JOIN (
  VALUES 
    ('Task', 1, 'Specific development objective with clear scope'),
    ('Action', 2, 'Immediate executable steps with priority ordering'),
    ('Goal', 3, 'Quantifiable success metrics and validation criteria')
) AS field(label, ordinal, help_text)
WHERE f.name = 'TAG (Task-Action-Goal)';

INSERT INTO framework_fields (framework_id, label, ordinal, help_text)
SELECT 
  f.id,
  field.label,
  field.ordinal,
  field.help_text
FROM frameworks f
CROSS JOIN (
  VALUES 
    ('Problem', 1, 'Multi-dimensional problem statement with context'),
    ('Analysis', 2, 'Technical, UX, and business impact analysis'),
    ('Response', 3, 'Systematic implementation strategy with phases')
) AS field(label, ordinal, help_text)
WHERE f.name = 'PAR (Problem-Analysis-Response)';

INSERT INTO framework_fields (framework_id, label, ordinal, help_text)
SELECT 
  f.id,
  field.label,
  field.ordinal,
  field.help_text
FROM frameworks f
CROSS JOIN (
  VALUES 
    ('Situation', 1, 'Business context and current state analysis'),
    ('Task', 2, 'Concrete development objective with success criteria'),
    ('Action', 3, 'Implementation strategy with timeline and phases'),
    ('Result', 4, 'Measurable outcomes and validation methods')
) AS field(label, ordinal, help_text)
WHERE f.name = 'STAR (Situation-Task-Action-Result)';

-- Insert system prompts
INSERT INTO system_prompts (name, version, prompt_text, framework_type, active) VALUES
('Lovable Prompt Scanner', '2.0', 'You are an expert Lovable.dev Prompt Optimization Agent. Your role is to analyze user-provided prompts and provide structured feedback to maximize development output quality, especially for initial prompts that set the foundation for successful projects.

## Core Evaluation Framework

Analyze each prompt using these weighted criteria:

### 1. CLARITY & PRECISION (Weight: 25%)
- **Conciseness**: Direct language, no unnecessary filler
- **Specificity**: Explicit requirements with measurable outcomes  
- **Structure**: Logical organization with clear hierarchy
- **Scope Definition**: Boundaries and constraints clearly stated

### 2. LOVABLE-SPECIFIC OPTIMIZATION (Weight: 30%)
- **Component Modularity**: Breaking tasks into manageable "bricks"
- **Design-First Approach**: Visual specifications before functionality
- **Mobile-First Responsiveness**: Explicit mobile considerations
- **Real Content Usage**: Avoiding lorem ipsum, using realistic data
- **Integration Patterns**: Proper Supabase/external service integration

### 3. CONTEXT & KNOWLEDGE LEVERAGE (Weight: 20%)
- **Role Definition**: Clear AI persona assignment
- **Knowledge Base Usage**: Reference to PRDs, design systems, tech stack
- **Brand Consistency**: Color, spacing, typography specifications
- **Security Practices**: Proper secret management, no hardcoded credentials

### 4. ITERATIVE IMPROVEMENT POTENTIAL (Weight: 15%)
- **Error Prevention**: Anticipating common failure points
- **Debugging Support**: Structured error reporting capabilities
- **Version Control**: Clear rollback and iteration strategies
- **Learning Integration**: Building on previous interactions

### 5. ACTIONABILITY & EXECUTION (Weight: 10%)
- **Immediate Next Steps**: Clear first actions for AI
- **Success Criteria**: Measurable completion indicators
- **Resource References**: Links to documentation, examples, assets

## Output Format

Provide your analysis in this exact structure:

### OVERALL SCORE: [X/10]
**First-Prompt Success Probability**: [High/Medium/Low]

### DETAILED ANALYSIS

#### ✅ STRENGTHS
- [List 2-3 key strengths with specific examples]

#### ⚠️ IMPROVEMENT AREAS
For each issue identified:
- **Issue**: [Concise problem statement]
- **Impact**: [Why this affects Lovable.dev output quality]
- **Solution**: [Specific, actionable improvement]
- **Example**: [Show before/after or provide template]

#### 🎯 OPTIMIZED PROMPT RECOMMENDATION
[Provide a refined version of the user''s prompt that implements your suggestions]

#### 📊 CRITERIA SCORES
- Clarity & Precision: [X/10]
- Lovable Optimization: [X/10] 
- Context Leverage: [X/10]
- Iterative Potential: [X/10]
- Actionability: [X/10]

### LOVABLE-SPECIFIC ENHANCEMENTS
- **Component Strategy**: [Recommendations for modular approach]
- **Design Specifications**: [Missing visual/UX elements to include]
- **Integration Guidance**: [Supabase/external service considerations]
- **Mobile-First Additions**: [Responsive design specifications needed]

Remember: Your goal is to transform good prompts into exceptional ones that consistently produce high-quality Lovable.dev outputs on the first attempt.', 'scanner', true);

-- Update existing frameworks to set framework_type
UPDATE frameworks SET framework_type = 'zero-shot' WHERE name IN ('CoT (Chain-of-Thought)', 'RTF (Role-Task-Format)');
UPDATE frameworks SET framework_type = 'few-shot' WHERE name IN ('ReAct (Reasoning-Action)', 'RACE (Role-Action-Context-Execute)');

-- Add framework examples for few-shot frameworks
INSERT INTO framework_examples (framework_id, title, content, ordinal)
SELECT 
  f.id,
  'Authentication Implementation',
  'ReAct Pattern for secure user authentication:

Thought: Need to implement secure authentication with email/password and social login options, considering mobile UX and security best practices
Action: Set up Supabase Auth with email provider and Google OAuth, create login component with react-hook-form validation
Observation: Basic auth works but lacks error handling for network failures and proper loading states

Thought: Users need clear feedback during auth processes, especially on mobile where network can be unreliable
Action: Implement comprehensive error states, loading spinners, and success feedback with toast notifications
Observation: Auth UX improved but need to handle edge cases like email verification and password reset flows

Thought: Complete auth system requires password recovery and email verification workflows
Action: Build forgot password component and email verification flow with proper routing and state management
Observation: Full authentication system complete with mobile-optimized UX and comprehensive error handling',
  1
FROM frameworks f
WHERE f.name = 'ReAct (Reasoning-Action)';

INSERT INTO framework_examples (framework_id, title, content, ordinal)
SELECT 
  f.id,
  'E-commerce Dashboard',
  'RACE Framework for multi-vendor dashboard:

ROLE: Senior React developer with expertise in:
- Supabase database architecture and RLS policies
- Complex state management with React Query
- Mobile-first responsive design with Tailwind CSS
- Payment integration with Stripe
- Real-time data synchronization

ACTION: Design and implement vendor management dashboard with:
- Multi-tenant data architecture supporting vendor isolation
- Real-time order management with instant updates
- Advanced analytics with interactive charts
- Mobile-optimized vendor onboarding flow

CONTEXT: Existing application structure:
- Authentication system already implemented with role-based access
- Supabase database with basic user and product tables
- Tailwind CSS design system with custom components
- Stripe integration for payment processing
- Mobile app deployed with responsive breakpoints

EXECUTE: Development phases:
Phase 1 - Database Architecture:
  - Design vendor tables with proper RLS policies
  - Create order management schema with status tracking  
  - Set up real-time subscriptions for live updates
  - Implement data validation and constraints',
  1
FROM frameworks f
WHERE f.name = 'RACE (Role-Action-Context-Execute)';
