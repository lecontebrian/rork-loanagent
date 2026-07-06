/**
 * Central media asset registry for LoanVault.
 * All AI-generated assets (images, audio, video, 3D) are referenced here
 * so screens can consume them without hardcoding URLs.
 *
 * Image URLs are direct R2 URLs returned by generateImageAsset.
 * Audio URLs use the https://rork.app/pa/{projectId}/{uniqueKey} pattern.
 */

const PROJECT_ID = 'n0qyz0xrra1lxcz6lfus4';
const PA_BASE = `https://rork.app/pa/${PROJECT_ID}`;

export const images = {
  onboardingWelcome:
    'https://r2-pub.rork.com/projects/n0qyz0xrra1lxcz6lfus4/assets/6116a35d-91a6-49cf-a73e-e526c4d0e422.png',
  onboardingAiAgent:
    'https://r2-pub.rork.com/projects/n0qyz0xrra1lxcz6lfus4/assets/7463f987-14f4-459f-b587-c28a2b75346a.png',
  premiumHero:
    'https://r2-pub.rork.com/projects/n0qyz0xrra1lxcz6lfus4/assets/02f5570d-67d2-489e-b355-1badf8c9e220.png',
  aiAgentAvatar:
    'https://r2-pub.rork.com/projects/n0qyz0xrra1lxcz6lfus4/assets/967e93cc-2c83-4406-b10d-0dd14b7242f0.png',
  dashboardBanner:
    'https://r2-pub.rork.com/projects/n0qyz0xrra1lxcz6lfus4/assets/0e1facad-0279-4d3d-95f3-555bf724e515.png',
  creditBuilderHero:
    'https://r2-pub.rork.com/projects/n0qyz0xrra1lxcz6lfus4/assets/c5f5386e-b8c7-43e5-8299-6940e4f3f427.png',
  emptyStateLoans:
    'https://r2-pub.rork.com/projects/n0qyz0xrra1lxcz6lfus4/assets/82dbd634-9608-4f4a-bdb2-91086d46e5cd.png',
  emptyStateP2P:
    'https://r2-pub.rork.com/projects/n0qyz0xrra1lxcz6lfus4/assets/31891e97-2bb2-408d-8450-36c119897c3d.png',
  emptyStateDocuments:
    'https://r2-pub.rork.com/projects/n0qyz0xrra1lxcz6lfus4/assets/64abb629-b5e4-4453-9947-cca7ef908767.png',
  categoryMortgage:
    'https://r2-pub.rork.com/projects/n0qyz0xrra1lxcz6lfus4/assets/6dc4d7ba-6236-45b8-9007-794aa7d6aaef.png',
  categoryAuto:
    'https://r2-pub.rork.com/projects/n0qyz0xrra1lxcz6lfus4/assets/c23ad9f7-46c8-495c-b08f-a1a6da0a1827.png',
  categoryBusiness:
    'https://r2-pub.rork.com/projects/n0qyz0xrra1lxcz6lfus4/assets/aa6fe54d-7ebb-412c-bef2-0de20147bee3.png',
  categoryPersonal:
    'https://r2-pub.rork.com/projects/n0qyz0xrra1lxcz6lfus4/assets/8279fa18-7a0f-4e82-bb9e-471c9f3643dd.png',
  categoryStudent:
    'https://r2-pub.rork.com/projects/n0qyz0xrra1lxcz6lfus4/assets/e8f64124-13bd-4259-9d1a-13fd3170fbf4.png',
} as const;

/** Map loan category id → generated category image URL */
export const categoryImages: Record<string, string> = {
  home: images.categoryMortgage,
  auto: images.categoryAuto,
  business: images.categoryBusiness,
  personal: images.categoryPersonal,
  education: images.categoryStudent,
};

export const audio = {
  /** Soft cinematic vault unlock whoosh + low chime — splash screen */
  splashSound: `${PA_BASE}/vault_unlock_cinematic`,
  /** Warm ascending success chime — loan approval / transaction success */
  successChime: `${PA_BASE}/approval_chime_ascending`,
  /** Soft low error tone — validation failures */
  errorThud: `${PA_BASE}/soft_error_thud`,
} as const;

export const audioKeys = {
  splashSound: 'vault_unlock_cinematic',
  successChime: 'approval_chime_ascending',
  errorThud: 'soft_error_thud',
} as const;

export type SoundName = keyof typeof audio;
