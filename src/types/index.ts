export interface SituationInput {
  placeholder: string;
  maxLength: number;
  validation: string;
}

export interface ToneSlider {
  range: [number, number];
  default: number;
  labels: {
    left: string;
    right: string;
  };
}

export interface APIRequest {
  situation: string;
  tone: number; // 0-100
}

export interface APIResponse {
  excuse: string;
  error?: string;
}

export interface FallbackExcuse {
  innocent: string[];
  neutral: string[];
  confident: string[];
}

export type ToneType = 'innocent' | 'neutral' | 'confident';

export interface ExcuseResult {
  excuse: string;
  isFromAPI: boolean;
  tone: ToneType;
}