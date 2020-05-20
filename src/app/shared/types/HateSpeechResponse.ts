export interface HateSpeechResponse {
  tags: { tag: string, probability: number, source: string }[];
  text: string;
}
