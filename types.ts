
export type ScaleType = 'likert' | 'dichotomous' | 'nominal' | 'ordinal' | 'ratio';

// Added Question interface to fix the import error in App.tsx
export interface Question {
  id: string;
  text: string;
}

export interface StatisticalMethod {
  name: string;
  description: string;
  spssInstruction: string;
}

export interface AnalysisResult {
  probability: number;
  reasoning: string;
  potentialCorrelations: string[];
  suggestedMethods: StatisticalMethod[];
  recommendations: string[];
  significanceLevel: 'Төмен' | 'Орташа' | 'Жоғары';
}

export interface SurveyInput {
  topic: string;
  scaleType: ScaleType;
  questions: string[];
}