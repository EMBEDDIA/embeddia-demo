export interface KeywordExtractionResponse {
  [key: string]: JSI[] | HYBRID[] | MLP;
}

export interface JSI {
  tag: string;
}

export interface HYBRID {
  tag: string;
  probability: number;

}

export interface MLP {
  text: { lang: string, lemmas: string, pos_tags: string, text: string };
  texta_facts: {doc_path: string, fact: string, str_val: string}[];
}
