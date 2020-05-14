export interface HateSpeechResponse {
  [key: string]: { tag: string, probability: number }[];
}
