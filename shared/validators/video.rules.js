export const VIDEO_CLASSIFICATIONS = ['ia', 'hybrid'];
export const CONTRIBUTOR_GENDERS = ['women', 'man', 'other'];
export const SOCIAL_PLATFORMS = ['facebook', 'instagram', 'x', 'linkedin', 'youtube', 'tiktok', 'website'];

export const VIDEO_LIMITS = {
  title: { min: 2, max: 255, required: false },
  titleEN: { min: 2, max: 255, required: true },
  language: { min: 2, max: 50, required: true },
  synopsis: { min: 10, max: 500, required: false },
  synopsisEN: { min: 10, max: 500, required: true },
  techResume: { min: 10, max: 500, required: true },
  creativeResume: { min: 10, max: 500, required: true },
  tags: { maxItems: 10, minLength: 2, maxLength: 20 },
};

export const VIDEO_SECURITY_LIMITS = {
  recaptchaTokenMaxLength: 20000,
  contributorsPayloadMaxLength: 50000,
  socialNetworksPayloadMaxLength: 20000,
  maxContributors: 20,
  maxSocialNetworks: 7,
  socialUrlMaxLength: 500,
};

export const VIDEO_PATTERNS = {
  title: /^[a-zA-Z0-9À-ÿ\s',.!?:()-]+$/,
  language: /^[a-zA-ZÀ-ÿ\s-]+$/,
  tag: /^[a-zA-Z0-9À-ÿ-]+$/,
};

export const normalizeText = (value) => String(value ?? '').trim();
