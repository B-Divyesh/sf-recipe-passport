export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  steps: string[];
  yield: string;
  notes: string;
  sourceName: string;
  sourceUrl: string;
  categories: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CookbookExport {
  schema: 'recipe-passport/v1';
  exportedAt: string;
  recipes: Recipe[];
}

export type AppMode = 'real' | 'demo';
