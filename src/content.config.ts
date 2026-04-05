import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const posts = defineCollection({
  // Load Markdown and MDX files in the `src/Blog/posts/` directory.
  loader: glob({ base: './src/Blog/posts', pattern: '**/*.{md,mdx}' }),
  // Type-check frontmatter using a schema
  schema: () =>
    z.object({
      title: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      image: z.string().optional(),
      tags: z.array(z.string()).optional(),
      category: z.string().optional()
    })
})

const about = defineCollection({
  // Load Markdown files in the `src/Blog/about/` directory.
  loader: glob({ base: './src/Blog/about', pattern: '**/*.md' }),
  // Type-check frontmatter using a schema
  schema: z.object({})
})

export const collections = { posts, about }
