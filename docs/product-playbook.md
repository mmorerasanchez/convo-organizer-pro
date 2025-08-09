# Promptito Product Playbook

Last updated: 2025-08-09

## 1. Business Objectives
- Help teams design, test, and operationalize high‑quality AI prompts.
- Centralize conversations, knowledge, and templates per project to improve reuse and governance.
- Provide analytics, usage limits, and subscription flows to sustain the product.

## 2. User Needs (Brief)
- Rapid prompt iteration with structured frameworks and live testing.
- Scan/Improve prompts with clear diffs and acceptance flow.
- Organize content by project; share projects safely with teammates.
- Track what works (prompt analytics) and progress through learning content.
- Simple subscriptions and clear usage limits.

## 3. Design System
- Tech: React + Vite + Tailwind + shadcn/ui components.
- Color/typography tokens live in index.css and tailwind.config.ts; use semantic tokens via HSL only (no hard-coded colors).
- Components: Button, Card, Tabs, Dialog, Sheet, Sidebar, Table, Tooltip, Toast (sonner) with design tokens.
- Responsive-first; dark-mode aware via CSS variables.

## 4. Functional Description
- Prompting Hub
  - Scanner: Improve prompt; feedback loop; save to project; model/params controls.
  - Designer: Framework fields, compile/test prompt, versioning integration points.
  - Playbook: Guided learning with progress and bookmarks per user.
- Projects
  - Create, list, filter; share via project_shares; attach knowledge files; conversations tracking.
- Tools Library
  - Personal tools with model metadata.
- Analytics
  - Dashboard KPIs and charts; optional Mixpanel tracking; PageTracker.
- Subscriptions & Limits
  - plan_limits table drives request caps/pricing; subscribers table stores status and tier.
  - Edge functions: create-checkout, check-subscription, customer-portal, usage-status.

## 5. Basic User Journey
1) Sign up or sign in.
2) Land on Dashboard with overview and analytics.
3) Create a Project; add Knowledge or Conversations.
4) Use Prompting > Scanner or Designer; iterate and save to project.
5) Optionally subscribe to raise limits; manage via Stripe portal.
6) Learn via Playbook; progress and bookmarks persist per user.

## 6. Information Architecture
- Top-level: Dashboard, Projects, Prompting, Tools, Docs (Playbook), Auth pages.
- Within Projects: Grid/List, Detail with tabs (Conversations, Knowledge, Share).
- Prompting: Tabs for Scanner, Designer, Playbook.

## 7. Database Schema (key tables)
- projects(user_id, name, description, status, learning_frequency, share_link)
- project_shares(project_id, shared_with_user_id)
- conversations(project_id, model_id, title, content, platform, status, type)
- knowledge(project_id, file_path, file_type, file_name, title, description)
- templates(...), template_versions(...), template_usage(...)
- frameworks, framework_fields, framework_examples (public read)
- prompt_analytics(user_id, framework_id, system_prompt_id, ratings, times)
- guide_progress(user_id, chapter_id, slide_id, completed, time_spent_seconds) [UNIQUE (user_id, chapter_id, slide_id)]
- guide_bookmarks(user_id, chapter_id, slide_id, notes) [UNIQUE (user_id, chapter_id, slide_id)]
- models (public read), system_prompts (public read active)
- plan_limits(plan_name, monthly_request_limit, monthly_price_cents, yearly_price_cents, currency)
- subscribers(user_id, email, subscribed, subscription_tier, subscription_end, stripe_customer_id, billing_interval)
- ai_usage(user_id, tokens_in, tokens_out, success, cost_usd, provider, model, function, metadata)

All relevant tables have RLS; sharing and ownership rules are enforced via auth.uid().

## 8. Integrations
- Supabase Auth, Database, Storage, Edge Functions.
- Mixpanel analytics via lib/analytics/mixpanel.ts (opt-in/out supported in UI).
- Stripe via Edge Functions: create-checkout, customer-portal, check-subscription.
- Model providers (OpenAI, Anthropic, Google, OpenRouter) detected via provider-status function.

## 9. Edge Functions (high level)
- create-checkout: Creates Stripe subscription session from plan_limits; redirects user.
- customer-portal: Opens Stripe Billing Portal for management.
- check-subscription: Syncs Stripe subscription to subscribers table; used on login/refresh.
- usage-status: Returns remaining usage; used by UI limits.
- provider-status: Reports which provider API keys exist.

## 10. Project Guidelines
- Prioritize: Simplicity, responsive UX, clear feedback, secure defaults, and performance.
- Avoid: Hard-coded colors or ad-hoc styles; bypassing RLS; raw SQL from frontend/edges.
- Decisions: Favor design system tokens; small focused components; search-replace edits; minimize complexity.

## 11. User Personas
- Prompt Engineer: Needs fast iteration, diffs, model param control, save/load prompts.
- Product Manager: Wants analytics, project organization, sharing, and subscription management.
- Practitioner/Learner: Uses Playbook, tracks progress, bookmarks, low friction UX.

## 12. Design Assets
- Colors/typography: Defined via Tailwind tokens in index.css and tailwind.config.ts using HSL.
- Layout: MainLayout with Sidebar, PageHeader, and content grid spacing (gap-6, space-y-6/8).
- Components: shadcn/ui variants configured to match semantic tokens.

## 13. Coding Conventions
- Naming: PascalCase components, camelCase hooks/utils, kebab-case file names for folders and snake_case only in DB.
- Formatting: Prettier style via ESLint defaults; no inline color values; use semantic tokens.
- Structure: Pages under src/pages; UI under src/components/ui; features under components/<feature>.

## 14. External References
- Supabase: Dashboard, SQL, Auth, Storage, Functions.
- Stripe: API keys and Billing Portal docs.
- shadcn/ui & TailwindCSS.

## 15. Security Practices
- Enforce RLS on all user data; edge functions using service role key only for trusted writes.
- Never expose secrets to frontend; use Supabase Functions for server-side operations.
- Validate inputs; log important steps in edge functions for auditability.

## 16. Compliance
- Stripe PCI handled by Stripe Checkout/Portal.
- Respect analytics opt-out; store minimal PII; follow data deletion on account removal.
- If applicable, GDPR considerations: consent for analytics, data export/delete flows via Supabase.

## 17. Status Checks (Production)
- Tables: plan_limits, subscribers, ai_usage exist; guide_progress and guide_bookmarks have uniqueness constraints.
- Secrets: OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY, OPENROUTER_API_KEY, STRIPE_SECRET_KEY, SUPABASE_* set.
- Plan limits seeded (4 rows) ready for checkout.

