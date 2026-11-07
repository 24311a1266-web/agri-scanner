import { LabelAnalysisResponse, TrustedProduct, EvaluationMetric, LanguageCode } from '../types';

export async function scanLabel(
  imageBase64: string,
  mimeType: string = 'image/jpeg',
  language: LanguageCode = 'english',
  barcode?: string
): Promise<LabelAnalysisResponse> {
  const response = await fetch('/api/scan-label', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      imageBase64,
      mimeType,
      language,
      barcode,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with ${response.status}`);
  }

  return response.json();
}

export async function requestTtsAudio(
  text: string,
  language: LanguageCode = 'english'
): Promise<{ audioData?: string; fallbackToWebSpeech?: boolean; textToSpeak?: string; language?: string }> {
  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, language }),
  });

  if (!response.ok) {
    return { fallbackToWebSpeech: true, textToSpeak: text, language };
  }

  return response.json();
}

export async function askQuestionAboutLabel(
  question: string,
  scanContext: any,
  language: LanguageCode = 'english'
): Promise<{ answer: string }> {
  const response = await fetch('/api/ask-label', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question,
      scanContext,
      language,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to get answer from AgriScanner');
  }

  return response.json();
}

export async function fetchTrustedCatalog(): Promise<TrustedProduct[]> {
  const response = await fetch('/api/trusted-catalog');
  if (!response.ok) throw new Error('Failed to load trusted catalog');
  const data = await response.json();
  return data.products || [];
}

export async function fetchEvaluationMetrics(): Promise<EvaluationMetric[]> {
  const response = await fetch('/api/evaluation-metrics');
  if (!response.ok) throw new Error('Failed to load evaluation metrics');
  const data = await response.json();
  return data.metrics || [];
}
