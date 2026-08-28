import { describe, expect, it } from 'vitest';
import { cookbookExport, normalizeRecipe, parseRecipeJson, searchRecipes } from '../../src/recipes';

const paprika = {
  uid: 'paprika-one',
  name: 'Roast tomato soup',
  ingredients: '6 tomatoes\n2 garlic cloves\n500 ml stock',
  directions: 'Roast the tomatoes.\nBlend with the stock.',
  servings: 'Serves 4',
  notes: 'Freeze for up to one month.',
  source: 'Old Paprika library',
  source_url: 'https://example.com/soup',
};

describe('recipe normalization', () => {
  it('retains every success-measure field from Paprika JSON', () => {
    const [recipe] = parseRecipeJson(JSON.stringify([paprika]));
    expect(recipe).toMatchObject({
      id: 'paprika-one',
      title: 'Roast tomato soup',
      ingredients: ['6 tomatoes', '2 garlic cloves', '500 ml stock'],
      steps: ['Roast the tomatoes.', 'Blend with the stock.'],
      yield: 'Serves 4',
      notes: 'Freeze for up to one month.',
      sourceName: 'Old Paprika library',
      sourceUrl: 'https://example.com/soup',
    });
  });

  it('accepts Recipe Passport exports', () => {
    const recipe = normalizeRecipe(paprika);
    const output = cookbookExport([recipe]);
    expect(parseRecipeJson(JSON.stringify(output))).toHaveLength(1);
  });

  it('finds recipes by ingredient without changing the source list', () => {
    const recipe = normalizeRecipe(paprika);
    expect(searchRecipes([recipe], 'GARLIC')).toEqual([recipe]);
    expect(searchRecipes([recipe], 'banana')).toEqual([]);
  });

  it('gives useful errors for malformed input', () => {
    expect(() => parseRecipeJson('{nope')).toThrow('not valid JSON');
    expect(() => normalizeRecipe({ name: 'Untested' })).toThrow('no ingredients');
  });
});
