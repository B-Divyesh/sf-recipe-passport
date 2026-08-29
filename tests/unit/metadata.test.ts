import { describe, expect, it } from 'vitest';
import { metadataForPath, recipeDocumentTitle, staticRouteMetadata } from '../../src/metadata';

describe('route metadata limits', () => {
  it('keeps every static document title within 60 characters', () => {
    for (const metadata of Object.values(staticRouteMetadata)) {
      expect(metadata.title.length).toBeLessThanOrEqual(60);
      expect(metadata.description.length).toBeLessThanOrEqual(155);
    }
  });

  it('clips a long recipe document title without changing the stored display title', () => {
    const recipeTitle = 'L'.repeat(200);
    const title = recipeDocumentTitle(recipeTitle);
    expect(title).toHaveLength(60);
    expect(title).toMatch(/… — Recipe Passport$/);
    const metadata = metadataForPath('/recipe', recipeTitle, '/recipe?id=long-title');
    expect(metadata.title).toBe(title);
    expect(metadata.description.length).toBeLessThanOrEqual(155);
    expect(metadata.canonicalPath).toBe('/recipe?id=long-title');
  });
});
