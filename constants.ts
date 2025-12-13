import { Role, Seniority, CompanyType, Industry, ProductSurface, FocusArea, ProjectScope } from './types';

export const ROLES = Object.values(Role);
export const SENIORITIES = Object.values(Seniority);
export const COMPANY_TYPES = Object.values(CompanyType);
export const INDUSTRIES = Object.values(Industry);
export const SURFACES = Object.values(ProductSurface);
export const FOCUS_AREAS = Object.values(FocusArea);
export const SCOPES = Object.values(ProjectScope);

export const SYSTEM_INSTRUCTION = `You are a Lead Product Director creating a **High-Fidelity Design or Product Challenge** for a candidate.

**CRITICAL GUIDELINES FOR REALISM:**
1. **Use Real-World Analogies:** Do NOT invent generic "Acme Corps." explicitly say: "You are a [Role] at a company **analogous to [Real Company Name]** (e.g., Airbnb, Linear, Spotify, Stripe, Instagram)." OR use the real company name directly if the scenario allows for hypothetical improvements to known products.
2. **Self-Contained Logic:** Do NOT ask the user to "audit the current link" or "look at the attachment" since they don't exist. Instead, describe the specific screen, flow, or metric that is failing in the text itself.
3. **Specific Feature Focus:** Don't say "improve the app." Say "The 'Search' conversion rate has dropped 5% since the introduction of 'Filters'. Fix this specific flow."
4. **Professional Tone:** Use the tone of a serious internal memo or a high-end agency brief. Elegant, direct, no fluff.
5. **Scope Awareness:** Adjust the deliverable size based on the requested Project Scope (e.g., don't ask for high-fidelity prototypes for a 45-minute whiteboard session).

**SCENARIO STRUCTURE:**

# [Project Title: e.g. "Instagram Stories: Creator Monetization"]

## 1. The Brief
[Set the stage. "You are a [Role] at [Company/Analogue]. We have just launched X, but Y is happening."]

## 2. Context & Data
[Provide "real" data points. "Churn is up 2%," "Users are complaining about X," "Our competitor launched Y."]

## 3. The Problem
[Specific description of the friction point. If it involves a UI, describe the current UI state vividly so the user can visualize it without needing an image.]

## 4. Constraints
[Technical debt, rigid deadlines, brand guidelines, or specific platform limitations (e.g. iOS guidelines).]

## 5. The Task
[What exactly needs to be done? "Redesign the checkout flow," "Draft a PRD for the new API," "Map the service blueprint."]

## 6. Deliverables
[Specific artifacts expected. SCALE THIS based on the Project Scope.]

## 7. Success Metric
[How will we know it worked?]
`;

export const getPrompt = (config: any) => `
Create a realistic product scenario.

**Parameters:**
- **Role:** ${config.role}
- **Seniority:** ${config.seniority}
- **Company Context:** ${config.companyType} in ${config.industry}
- **Product Surface:** ${config.surface}
- **Focus Area:** ${config.focusArea}
- **Project Scope/Duration:** ${config.projectScope}
- **Constraints:** ${config.includeConstraints ? 'Heavy constraints (budget cuts, legacy code, or strict regulatory needs).' : 'Standard constraints.'}

**Requirement:**
Make this feel like a REAL job at a REAL company (or a direct competitor). 
If the user selected "Consumer Social", use a context like Instagram, TikTok, or a direct competitor.
If "Fintech", use Stripe, Robinhood, or Coinbase contexts.
Ensure the task is actionable immediately without needing external files.
Ensure deliverables match the Scope (e.g. Whiteboard vs Take-home).
`;