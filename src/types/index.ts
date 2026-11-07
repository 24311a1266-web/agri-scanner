export type LanguageCode = 'english' | 'telugu' | 'hindi' | 'tamil' | 'kannada' | 'marathi';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  exampleGreeting: string;
}

export interface ImageQualityAssessment {
  isUsable: boolean;
  qualityScore: number;
  blurDetected: boolean;
  glareDetected: boolean;
  cropDetected: boolean;
  lightingStatus: 'Good' | 'Low Light' | 'Overexposed' | string;
  retakeGuidance: string;
}

export interface ExtractedFields {
  productName: string;
  brandOrManufacturer?: string;
  category: 'Insecticide' | 'Fungicide' | 'Herbicide' | 'Seed' | 'Bio-stimulant' | 'Fertilizer' | string;
  activeIngredients?: string;
  formulation?: string;
  batchNumber?: string;
  manufacturingDate?: string;
  expiryDate?: string;
  registrationNumber?: string;
  toxicityColorBand: 'Red' | 'Yellow' | 'Blue' | 'Green' | 'None' | string;
  rawOcrSnippet?: string;
  uncertainOrMissingFields?: string[];
}

export interface VerifiedCatalogMatch {
  matched: boolean;
  standardGenericName?: string;
  authorizedRegistrationNumber?: string;
  officialToxicityClassification?: string;
  cibrcApprovedCrops?: string[];
  benchmarkWaitingPeriodDays?: number;
  matchConfidence: 'High' | 'Moderate' | 'Low' | 'Unverified';
  externalVerificationNotes?: string;
}

export interface FarmerExplanation {
  language: string;
  summaryHeadline: string;
  whatIsItFor: string;
  recommendedUsageAndDosage: string;
  safetyPrecautionsAndPPE: string[];
  toxicityLevelExplanation: string;
  waitingPeriodBeforeHarvest: string;
  firstAidAndAntidote: string;
  safetyAlerts: string[];
}

export interface AudioScript {
  targetLanguageText: string;
  englishTranslationText: string;
  estimatedDurationSeconds?: number;
}

export interface SafetyGateVerdict {
  passed: boolean;
  isSafeToUseGuidance: boolean;
  reasons: string[];
  mandatoryDisclaimers: string[];
}

export interface LabelAnalysisResponse {
  imageQuality: ImageQualityAssessment;
  extractedFields: ExtractedFields;
  verifiedCatalogMatch: VerifiedCatalogMatch;
  farmerExplanation: FarmerExplanation;
  audioScript: AudioScript;
  safetyGateVerdict: SafetyGateVerdict;
}

export interface SampleLabel {
  id: string;
  name: string;
  type: string;
  description: string;
  toxicityBand: 'Red' | 'Yellow' | 'Blue' | 'Green';
  isChallenging?: boolean;
  challengeReason?: string;
  imageUrl: string;
  barcode: string;
}

export interface TrustedProduct {
  id: string;
  name: string;
  genericName: string;
  category: 'Insecticide' | 'Fungicide' | 'Herbicide' | 'Seed' | 'Bio-stimulant' | 'Fertilizer';
  manufacturer: string;
  cibrcRegNo: string;
  toxicityBand: 'Red' | 'Yellow' | 'Blue' | 'Green';
  toxicityClass: string;
  approvedCrops: string[];
  targetPests: string[];
  standardDosage: string;
  waitingPeriodDays: number;
  activeIngredients: string;
  antidote: string;
  barcode: string;
}

export interface EvaluationMetric {
  metric: string;
  method: string;
  target: string;
  currentMeasured: string;
  status: string;
  notes: string;
}
