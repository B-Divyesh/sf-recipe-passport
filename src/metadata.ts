export interface RouteMetadata {
  title: string;
  description: string;
  canonicalPath: string;
}

const recipeTitles: Record<string, string> = {
  '/demo/recipe/sample-braised-beans': 'Tomato-braised butter beans',
  '/demo/recipe/sample-lemon-cake': 'Lemon olive oil cake',
  '/demo/recipe/sample-noodle-salad': 'Cold sesame noodle salad',
};

export const staticRouteMetadata: Record<string, RouteMetadata> = {
  '/': {
    title: 'Recipe Passport — Keep recipes offline',
    description: 'Import Paprika JSON or paste recipes into a private, searchable cookbook you can print and export.',
    canonicalPath: '/',
  },
  '/cookbook': {
    title: 'Cookbook — Recipe Passport',
    description: 'Search and open recipes stored in this browser.',
    canonicalPath: '/cookbook',
  },
  '/demo': {
    title: 'Demo — Recipe Passport',
    description: 'Try a private cookbook with three isolated sample recipes.',
    canonicalPath: '/demo',
  },
  '/add': {
    title: 'Add recipes — Recipe Passport',
    description: 'Import Paprika JSON or paste a structured recipe.',
    canonicalPath: '/add',
  },
  '/demo/add': {
    title: 'Add a demo recipe — Recipe Passport',
    description: 'Try adding or importing a recipe without changing your real cookbook.',
    canonicalPath: '/demo/add',
  },
  '/recipe': {
    title: 'Recipe — Recipe Passport',
    description: 'Read a recipe stored in this browser.',
    canonicalPath: '/recipe',
  },
  '/demo/recipe': {
    title: 'Sample recipe — Recipe Passport',
    description: 'Read a sample recipe without changing your cookbook.',
    canonicalPath: '/demo/recipe',
  },
  '/privacy': {
    title: 'Privacy — Recipe Passport',
    description: 'How Recipe Passport stores recipe data in your browser.',
    canonicalPath: '/privacy',
  },
  '/terms': {
    title: 'Terms — Recipe Passport',
    description: 'Terms for using Recipe Passport.',
    canonicalPath: '/terms',
  },
  '/404': {
    title: 'Not found — Recipe Passport',
    description: 'This Recipe Passport page was not found.',
    canonicalPath: '/404',
  },
  ...Object.fromEntries(Object.entries(recipeTitles).map(([path, title]) => [path, {
    title: `${title} — Recipe Passport`,
    description: `Ingredients and method for ${title}.`,
    canonicalPath: path,
  }])),
};

export function metadataForPath(path: string, recipeTitle?: string, recipeCanonicalPath?: string): RouteMetadata {
  const normalized = path.replace(/\/$/, '') || '/';
  if (recipeTitle && (normalized === '/recipe' || normalized === '/demo/recipe')) {
    return {
      title: `${recipeTitle} — Recipe Passport`,
      description: `Ingredients and method for ${recipeTitle}.`,
      canonicalPath: recipeCanonicalPath ?? normalized,
    };
  }
  const known = staticRouteMetadata[normalized];
  if (known) return known;
  if (recipeTitle) {
    return {
      title: `${recipeTitle} — Recipe Passport`,
      description: `Ingredients and method for ${recipeTitle}.`,
      canonicalPath: normalized,
    };
  }
  return staticRouteMetadata['/404'];
}
