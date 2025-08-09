import { type Chapter } from './types';

export const chapters: Chapter[] = [
  {
    id: 'chapter-1',
    title: 'Welcome to AI‑Driven Building',
    description: 'Orientation + SEO snippet and how to use this playbook effectively.',
    slides: [
      {
        id: 'slide-1-2',
        title: 'Welcome + How this guide works',
        content: `## 1‑1. What is Lovable (and AI IDEs)?

Lovable is an AI‑powered IDE where you **describe** what you want, and it scaffolds real apps—UI, backend, auth, and integrations. No local setup. No manual package wrangling. You keep full code via GitHub sync.

**Why it matters**

* Build in hours, not weeks.
* Non‑technical creators can ship; technical teams move faster.
* Best of both worlds: AI scaffolds → humans refine.

## 1‑2. How this guide works

This playbook turns fuzzy ideas into shipped features with **clear prompts**, **small steps**, and **repeatable patterns**. Each section includes:

* **What to do** (and why)
* **Prompt templates** you can paste
* **Short code exa****mples**
* **Tables & checklists** for quick recall

> **Starter Prompt**

\`\`\`
You are a senior AI coding assistant working in Lovable on my project.
Goal: Scaffold a minimal landing page with a hero, features grid, CTA, and footer.
Constraints: Tailwind + shadcn/ui, mobile-first, WCAG AA colors, no placeholder lorem—use simple real copy.
Deliverables: One React page, extracted reusable <FeatureCard> component, and a quick readme section in the file header.
Don't change any other files.
\`\`\`
      `
      }
    ]
  },
  {
    id: 'chapter-2',
    title: 'Fundamentals of Effective Prompting',
    description: 'CLEAR framework, structure, context, and iteration patterns.',
    slides: [
      {
        id: 'slide-2-1',
        title: 'C.L.E.A.R., Structure, Knowledge & Iteration',
        content: `### 2‑1. The C.L.E.A.R. framework

| Principle      | What it means                           | Example                                                    |
| -------------- | --------------------------------------- | ---------------------------------------------------------- |
| **Concise**    | Remove fluff; say exactly what to build | “Create a /pricing page with 3 tiers and a FAQ accordion.” |
| **Logical**    | Order steps; think like a checklist     | “Plan first → scaffold → wire data → test roles.”          |
| **Explicit**   | State must‑haves and must‑nots          | “Use shadcn \`Card\`; do not edit \`AuthContext.tsx\`.”        |
| **Adaptive**   | Iterate based on results                | “Summarize what changed; propose 2 better variants.”       |
| **Reflective** | Capture learnings for reuse             | “Document decisions at the file top as comments.”          |

> **Prompt Structure Template**

\`\`\`
Role: [Set the AI's role]
Context: [Product vision, users, design system]
Task: [One specific outcome]
Guidelines: [Style, libs, accessibility, performance]
Constraints: [Files not to touch, limits, security]
Acceptance: [What proves it works]
\`\`\`

### 2‑2. Structure, Context & the Knowledge File

**Recommended prompt layout**

* **Context** → role + product + constraints
* **Task** → the smallest meaningful outcome
* **Guidelines** → patterns and libraries to prefer
* **Constraints** → what not to touch or change

**Knowledge File: what to include**

| Section        | Include                                            |
| -------------- | -------------------------------------------------- |
| Vision & Users | One‑liner value prop, primary personas             |
| IA & Routing   | Key pages, URL structure                           |
| Design System  | Colors, type scale, spacing (8pt), shadcn variants |
| UI Patterns    | Modals, toasts, forms, empty states                |
| Code Standards | Lint rules, folder layout, naming                  |
| Security       | Secrets policy, RLS posture, logging               |
| Integrations   | Supabase schema, Stripe usage, email provider      |

**Chat Mode vs Default Mode**

| Mode          | Use it for                                | Credit Risk |
| ------------- | ----------------------------------------- | ----------- |
| **Chat Mode** | Plan, analyze, debug without writing code | Low         |
| **Default**   | Make code changes now                     | Normal      |

> **Planning Prompt (Chat Mode)**

\`\`\`
Analyze current repo structure and list the safest next 3 steps to add a /pricing page.
For each step: files to touch, risks, and a rollback note.
No code yet.
\`\`\`

### 2‑3. Iteration & Refinement

* Work in **small, testable steps**.
* **Pin** stable versions; use History for quick rollbacks.
* Use **Meta‑Prompting** to improve unclear prompts.

> **Meta‑Prompting**

\`\`\`
My last prompt produced inconsistent layout. Rewrite my prompt to be unambiguous. Keep Tailwind + shadcn, mobile‑first, and do not touch auth.
\`\`\`

> **Reverse Meta‑Prompting**

\`\`\`
Summarize what changed in this edit, why it worked, and save a reusable mini‑prompt I can keep in my library.
\`\`\`
      `
      }
    ]
  },
  {
    id: 'chapter-3',
    title: 'Component‑Driven Development',
    description: 'Think in reusable components, design system, and composition.',
    slides: [
      {
        id: 'slide-3-1',
        title: 'Components, Design System, and Composition',
        content: `### 3‑1. Think in Components (like LEGO)

Ask for small, reusable blocks—**cards, badges, toasts, toggles, inputs**—then compose pages.

> **Component First Prompt**

\`\`\`
Create a reusable <FeatureCard title description icon /> using shadcn Card.
Constraints: responsive grid usage, focus ring visible, dark mode ready.
Provide usage example in a /components/examples file.
\`\`\`

### 3‑2. Design System Checklist

*

> **Example: FeatureCard.tsx**

\`\`\`tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

export default function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          {icon}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
\`\`\`

### 3‑3. Compose in Bricks

Build one **brick** (feature/flow) at a time → test → refine → move on. Always reuse global components—avoid one‑off styles.`
      }
    ]
  },
  {
    id: 'chapter-4',
    title: 'Advanced Prompting Techniques',
    description: 'Plan-first, context management, error handling & debugging.',
    slides: [
      {
        id: 'slide-4-1',
        title: 'Plan‑First, Context, and Error Handling',
        content: `### 4‑1. Multi‑Step Problem Solving

> **Plan‑First Template**

\`\`\`
Goal: Add a /pricing page.
Plan 5 steps max with files to touch, then wait for my OK.
Constraints: shadcn, mobile-first, copy in plain English (no lorem), do not modify auth or Stripe.
\`\`\`

### 4‑2. Context Management

* Repeat key rules every few prompts.
* Use **openers/closers** to keep scope tight.

> **Opener / Closer**

\`\`\`
Opener: "Investigate and outline options—no code edits yet."
Closer: "Confirm only the files listed below were changed and summarize diffs."
\`\`\`

### 4‑3. Error Handling & Edge Cases

* Prefer **“Investigate, don’t write code yet”** when the issue is unclear.
* Provide **real logs** and **screenshots** for UI issues.

> **Debugging Prompts**

\`\`\`
Use the console error below to locate the root cause. Propose 2 safe fixes and the minimal diff.
[Paste error stack]
\`\`\`

\`\`\`
I suspect a state leak in <PricingTable/>. Audit for unnecessary re-renders and suggest memoization points.
\`\`\`
      `
      }
    ]
  },
  {
    id: 'chapter-5',
    title: 'Integrating External Services',
    description: 'APIs, GitHub sync, Supabase, Stripe, security, and advanced patterns.',
    slides: [
      {
        id: 'slide-5-1',
        title: 'Overview, APIs, GitHub, Supabase, Stripe, and More',
        content: `### 5‑1. Overview

Lovable knows common APIs and models. You describe the outcome; it wires code, packages, and env vars. You keep secrets server‑side.

### 5‑2. API Fundamentals

> **Edge Function Logging (Supabase)**

\`\`\`ts
// supabase/functions/checkout/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    console.log("/checkout start", { ts: Date.now() });
    // ...your logic
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    console.error("/checkout error", e);
    return new Response("Internal Error", { status: 500 });
  }
});
\`\`\`

### 5‑3. GitHub Integration (2‑way sync)

**Recommended workflow**

1. Scaffold in Lovable → 2) Review & pin → 3) Commit to GitHub → 4) Optional branch for refactors → 5) PR → 6) Merge → 7) Deploy.

> **Safeguard Prompt**

\`\`\`
Before editing, list the exact files you intend to change. After editing, output a summary diff and confirm no other files were touched.
\`\`\`

### 5‑4. Supabase (Auth, DB, RLS)

**Starter schema**

\`\`\`sql
create table profiles (
  id uuid primary key references auth.users(id),
  full_name text,
  created_at timestamp with time zone default now()
);

alter table profiles enable row level security;
create policy "profiles are self-readable" on profiles
for select using (auth.uid() = id);
create policy "profiles are self-updatable" on profiles
for update using (auth.uid() = id);
\`\`\`

> **RLS Prompt**

\`\`\`
Write least-privilege RLS for table \`subscriptions\` so users can only read their own rows. Admin role can read all. Show SQL.
\`\`\`

### 5‑5. Stripe (Payments)

> **Checkout Button (client)**

\`\`\`tsx
<button onClick={startCheckout} className="btn btn-primary">Buy Now</button>
\`\`\`

> **Server call (Edge Function)**

\`\`\`ts
// Create Stripe Checkout Session using server-side secret.
// Return the session URL; never expose secrets in the client.
\`\`\`

**Notes**: Link Stripe customers to **Supabase user IDs**. Store secrets in env; never hard‑code.

### 5‑6. Clerk (User Management)

Use when you need orgs, SSO, or richer profiles. Lovable integrates natively.

### 5‑7. LLMs (OpenAI, Claude, Groq, etc.)

> **System Prompt Example**

\`\`\`
You are a helpful nutritionist.
Style: friendly, precise, evidence-informed.
Output: 150 words; include 3 bullet tips.
\`\`\`

### 5‑8. Vision & Media APIs

Use GPT‑4o, Stable Diffusion, Replicate, Pexels, Exa for generation and analysis. Iterate prompts; keep references.

### 5‑9. Specialized Tools

* **ElevenLabs** for TTS
* **21st.dev** for high‑quality UI blocks
* **p5.js** for interactive visuals
* **Motion.dev** (Framer Motion) for animations
* **Make / n8n** for long, multi‑step backends

### 5‑10. Security Best Practices (Checklist)

*

### 5‑11. Integration Prompts

\`\`\`
Integrate Stripe subscriptions: 3 tiers (Starter, Pro, Team). Server-side checkout, link to Supabase users, add a /billing page with manage button. No code beyond listed files.
\`\`\`

### 5‑12. Advanced Patterns

* **Agentic flows** for orchestration
* **RAG** on your docs/data
* **n8n/Make** for long‑running and multi‑app workflows`
      }
    ]
  },
  {
    id: 'chapter-6',
    title: 'Performance & Optimization',
    description: 'Frontend performance patterns and safe refactoring.',
    slides: [
      {
        id: 'slide-6-1',
        title: 'Performance patterns and safe refactors',
        content: `### 6‑1. Frontend Performance

* Memoize expensive components (\`React.memo\`, \`useMemo\`, \`useCallback\`).
* Test motion on low‑end devices; prefer reduced motion.
* Minimize re‑renders via stable props and keys.

> **Pattern**

\`\`\`tsx
const PriceRow = React.memo(function PriceRow({ plan }) {
  return <div>{plan.name}</div>;
});
\`\`\`

### 6‑2. Refactoring Without Behavior Changes

> **Refactor Prompt**

\`\`\`
Refactor <PricingTable/> to smaller functions. Keep identical UI and outputs. List changes first, then apply them in one commit. Add tests if trivial.
\`\`\`

* Split long files
* Remove dead code
* Keep behavior identical`
      }
    ]
  },
  {
    id: 'chapter-7',
    title: 'Debugging & Troubleshooting',
    description: 'Triage map, evidence, prompts, and recovery notes.',
    slides: [
      {
        id: 'slide-7-1',
        title: 'Debugging recipes and prompts',
        content: `### 7‑1. Common Issues (Quick Map)

| Area         | Symptom                | First Move                                         |
| ------------ | ---------------------- | -------------------------------------------------- |
| UI/Layout    | Misalignment, overflow | Screenshot + ask “why is this misaligned? fix it.” |
| API          | 4xx/5xx errors         | Paste logs; have AI propose minimal diff           |
| Prompt       | Vague output           | Rewrite with C.L.E.A.R.                            |
| AI Looping   | Repeated patching      | Switch to Chat Mode → Investigate only             |
| Integrations | Webhook/auth issues    | Verify env & RLS; test in isolation                |

### 7‑2. “Try to Fix” Wisely

Use it once or twice. If it loops, stop → investigate with Chat Mode.

### 7‑3. Errors = Learning

After a fix, capture the **why** and the **snippet** as a reusable prompt.

### 7‑4. Chat Mode = Debug Co‑Pilot

Ask for state recap, attempted fixes, and a safe plan.

### 7‑5. Effective Debug Prompts

\`\`\`
Here is the stack trace and the component. Find the root cause and propose the minimal safe patch. Do not edit unrelated files.
\`\`\`

\`\`\`
Explain this error like I'm a junior dev. Then show a production-grade fix with error handling.
\`\`\`

### 7‑6. Provide Evidence

Always include: stack traces, screenshots, repro steps, and current/expected behavior.

### 7‑7. Ask “Why?” (Root Cause)

Don’t just fix; remove the cause.

### 7‑8. Codebase Audit Prompt

\`\`\`
Perform a codebase audit for architecture, modularity, naming, and DX. List top 10 risks with file references and suggest incremental fixes. No code changes yet.
\`\`\`

### 7‑9. Prompt Lifecycle & Versioning

Pin working versions. Compare diffs after bugs. Roll back if faster than fixing forward.

### 7‑10. Version Control & Recovery Notes

* Lovable rollbacks **don’t** revert Supabase migrations—handle manually.
* If you branch, don’t delete before switching back to \`main\` in Lovable.

### 7‑11. Troubleshooting Quick Reference

* **General**: Chat Mode → walkthrough → screenshots → targeted prompt
* **AI reliability**: Rephrase/simplify; rebuild from last good pin
* **Persistent errors**: Ask “what fixes have we tried?”; consider alternate approach

### 7‑12. Your Debugging Toolkit

* External AIs (ChatGPT/Claude/Groq/Cursor) for secondary opinions
* Browser DevTools (Elements/Network/Console)
* Community: Lovable Discord & docs`
      }
    ]
  },
  {
    id: 'chapter-8',
    title: 'Launching & Scaling',
    description: 'Deploy, domains, KPIs, revenue, SEO, and team patterns.',
    slides: [
      {
        id: 'slide-8-1',
        title: 'Launch, measure, and grow',
        content: `### 8‑1. Finishing Mindset

Ship small. Iterate with purpose. Launch = start of learning.

### 8‑2. Simple Deployment

Use Lovable’s deploy → .lovable.app domain.

### 8‑3. Custom Domain & Hosting

Connect GitHub to Netlify/Vercel/Kinsta; set DNS. Add HTTPS and redirects.

### 8‑4. Self‑Hosting & Control

Two‑way GitHub sync → PRs, CI/CD, and full portability.

### 8‑5. Measuring Success (KPIs)

Traffic, conversions, activation, retention. Add Sentry or similar for errors.

### 8‑6. Revenue & Proof

Stripe for subs/one‑time. Add trust markers (logos, testimonials). Charge early.

### 8‑7. Organic Marketing

Simple hooks, clear pains, native language of your audience. Consistency > frequency.

### 8‑8. Channel Testing

Talk to users. Cold outreach beats guesswork. Tune landing pages from feedback.

### 8‑9. SEO in Lovable

Set OG tags, SEO titles, and descriptions. Fast pages, accessible markup.

### 8‑10. SaaS Build Sequence

UI → DB → Auth → Core features → AI → Payments → Analytics.

### 8‑11. Lean Team with AI

Let AI scaffold; you orchestrate. Designer‑led is viable now.

### 8‑12. Long‑Term Sustainability

Improve a little every week. Be willing to restart when needed. Keep prompts updated.`
      }
    ]
  },
  {
    id: 'chapter-9',
    title: 'Workflow Enhancement Add‑ons & Appendix',
    description: 'Add‑ons, libraries, helpers + Appendix (prompts, tables, FAQ JSON‑LD).',
    slides: [
      {
        id: 'slide-9-1',
        title: 'Add‑ons, Libraries, and Appendix',
        content: `### 9‑1. Why Add‑ons?

They reduce friction: faster imports, stronger prompts, and smoother planning.

### 9‑2. Lovify by Talisha — Highlights

| Capability         | What you get                                  |
| ------------------ | --------------------------------------------- |
| Import from GitHub | Pull a repo into Lovable fast                 |
| Spark Prompts      | Context‑aware prompt suggestions              |
| PRDs & Planning    | Auto PRDs and progress tracking               |
| Voice Debugging    | Hands‑free troubleshooting                    |
| Cook Mode          | Reference‑image, pixel‑perfect UI             |
| Slash Commands     | Quick actions (/auth, /prompt, /integrations) |
| Live Code Analysis | Real‑time errors and tips                     |
| API Doc Parser     | Summaries and integration prompts             |

### 9‑3. Lovable.dev Add‑ons by Rezaul — Highlights

| Capability           | What you get                   |
| -------------------- | ------------------------------ |
| Voice Input          | Real‑time dictation to prompts |
| Prompt Library       | Structured prompts + Groq AI   |
| Project Manager      | Organize/navigate projects     |
| Advanced Chat Search | Find messages fast             |
| Smart Color Picker   | Grab/save colors from canvas   |
| SEO Tools            | Generate/validate meta tags    |
| Screenshot to Prompt | Turn references into actions   |
| Tech Stack Selector  | Align FE/BE stacks             |

### 9‑4. Prompt Libraries & Helpers

Keep a folder of **reusable prompts** (start, refactor, debug, integrate). Use dictation for long prompts if it helps you think aloud.

### 9‑5. Prompt2MVP

Start outside the IDE; write what you want. Break work into bricks. Prompt with purpose.

### 9‑6. External Model Integration

OpenAI, Claude, Groq, Mistral—for text, tools, and agents. Replicate for image/video/audio models.

### 9‑7. No‑Code Backends

Supabase (auth/db), Clerk (auth/orgs), n8n/Make (workflows). Connect as needed; keep logic minimal and modular.

### 9‑8. Dev Tools & GitHub Loop

Use standard GitHub collaboration (branches, PRs). Cursor or your IDE can refine code pushed by Lovable.

### 9‑9. Built‑in Integration Knowledge

Lovable installs/configures packages from context. You request the outcome; it wires the rest.

---

### Appendix: Prompt Library, Checklists & FAQ Schema

#### A1. Copy‑Paste Prompt Library

**Start a Feature**

\`\`\`
Role: Senior AI dev in Lovable.
Task: Add /pricing page with 3 tiers and FAQ.
Guidelines: Tailwind + shadcn; mobile-first; AA contrast; no lorem.
Constraints: Only touch /app/pricing/* and /components/pricing/*.
Acceptance: Renders on mobile/desktop; snapshot attached.
\`\`\`

**Investigate First**

\`\`\`
Investigate the failing signup flow. Summarize root cause candidates, affected files, and the safest fix. No code yet.
\`\`\`

**Refactor No Behavior Change**

\`\`\`
Refactor utils/formatPrice.ts into smaller pure functions. Keep identical outputs. Add 3 unit tests.
\`\`\`

**RLS Authoring**

\`\`\`
Write RLS so users can read/update only their profile row. Admin can read all. Show SQL and explain.
\`\`\`

**Stripe Subscriptions**

\`\`\`
Add subscriptions (Starter/Pro/Team). Server-side checkout, link Stripe customer to Supabase user id, add /billing with manage button. Show changed files only.
\`\`\`

**Codebase Audit**

\`\`\`
Audit architecture and DX. List top 10 risks with file paths and incremental fixes. No edits yet.
\`\`\`

#### A2. Do / Don’t Table

| Do                   | Don’t                            |
| -------------------- | -------------------------------- |
| Plan in Chat Mode    | Ask for a huge feature in one go |
| Work in bricks       | Edit unrelated files             |
| Be explicit          | Use lorem placeholders           |
| Pin versions         | Ignore diffs and rollbacks       |
| Provide logs/screens | Say “nothing works”              |

#### A3. Pre‑Publish Checklist

*

#### A4. JSON‑LD FAQ (SEO)

\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Lovable?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Lovable is an AI-powered IDE that scaffolds full-stack apps from natural language prompts with two-way GitHub sync."
      }
    },
    {
      "@type": "Question",
      "name": "How do I write better prompts?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use the C.L.E.A.R. framework—Concise, Logical, Explicit, Adaptive, Reflective—and work in small, testable steps."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use Supabase and Stripe?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Lovable integrates natively with Supabase and Stripe. Keep secrets server-side and use RLS for least-privilege access."
      }
    }
  ]
}
\`\`\`

---

**Last word:** Keep prompts short, specific, and scoped. Ship small, learn fast, and save what works into your own prompt library.`
      }
    ]
  }
];
