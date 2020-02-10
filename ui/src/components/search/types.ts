export interface SearchResult {
  fields: { [key: string]: any };
  id: string;
  matches: { [key: string]: string };
  type: string;
}

export interface SearchSuggestion {
  description: string;
  id: string;
  type: string;
}
