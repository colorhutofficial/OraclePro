export interface PredictionRecord {
  id: string;
  timestamp: number;
  inputValues: number[];
  predictedValue: number;
  confidence: 'High' | 'Medium' | 'Low';
  reasoning: string;
}

export interface MultiplierData {
  id: number;
  value: number;
  isPrediction?: boolean;
}

export interface AppSettings {
  modelName: string;
  enableNotifications: boolean;
  theme: 'dark' | 'light';
}
