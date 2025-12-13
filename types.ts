export enum Role {
  ProductDesigner = 'Product Designer',
  UXResearcher = 'UX Researcher',
  ProductManager = 'Product Manager',
  FullStackProduct = 'Full-stack Product Thinker',
}

export enum Seniority {
  Intern = 'Intern / Student',
  Junior = 'Junior',
  MidLevel = 'Mid-level',
  Senior = 'Senior',
  Staff = 'Staff / Lead',
}

export enum CompanyType {
  EarlyStage = 'Early-stage startup (Seed/Series A)',
  GrowthStage = 'Growth-stage startup (Series B-D)',
  PublicTech = 'Public tech company (FAANG-like)',
  Enterprise = 'Enterprise / B2B SaaS',
  Regulated = 'Regulated industry (Fintech, Health, Gov)',
}

export enum Industry {
  Fintech = 'Fintech',
  Healthcare = 'Healthcare',
  AIML = 'AI / ML',
  ConsumerSocial = 'Consumer Social',
  Marketplace = 'Marketplace',
  DevTools = 'Dev Tools',
  Climate = 'Climate Tech',
  Education = 'EdTech',
  Media = 'Media & Entertainment',
}

export enum ProductSurface {
  ConsumerApp = 'Consumer App (Mobile/Web)',
  InternalAdmin = 'Internal Admin Tool',
  Dashboard = 'Data Dashboard / Analytics',
  MobileFirst = 'Mobile-first Experience',
  DesktopFirst = 'Desktop-first / Pro Workflow',
  APIFirst = 'API / Platform Product',
}

export enum FocusArea {
  NewFeature = '0 -> 1 New Feature',
  Growth = 'Growth / Optimization',
  Retention = 'Retention / Churn Reduction',
  Monetization = 'Monetization / Pricing',
  TrustSafety = 'Trust & Safety',
  DesignSystem = 'Design Systems / Ops',
  Accessibility = 'Accessibility / Inclusion',
}

export enum ProjectScope {
  Whiteboard = 'Whiteboard Challenge (45 mins)',
  TakeHome = 'Take-home Assignment (1 week)',
  Quarterly = 'Quarterly Strategy (3 months)',
  Vision = 'Long-term Vision (1-2 years)',
}

export interface ScenarioConfig {
  role: Role | '';
  seniority: Seniority | '';
  companyType: CompanyType | '';
  industry: Industry | '';
  surface: ProductSurface | '';
  focusArea: FocusArea | '';
  projectScope: ProjectScope | '';
  includeConstraints: boolean;
}

export interface GenerationResponse {
  markdown: string;
}