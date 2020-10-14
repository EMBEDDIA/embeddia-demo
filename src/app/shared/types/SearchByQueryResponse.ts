export interface SearchByQueryResponse {
  results: { highlight: unknown, doc: unknown }[];
  count: number;
  aggs?: any;
}
