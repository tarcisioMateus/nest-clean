import { z } from 'zod'

/* 
  try to transform the input into a valid slug, otherwise reject it
*/
export const slugParamSchema = z
  .string()
  .transform((s) => {
    // Convert to lowercase
    let transformedSlug = s.toLowerCase()
    // Replace non-alphanumeric characters (except hyphens) with hyphens
    transformedSlug = transformedSlug.replace(/[^a-z0-9-]+/g, '-')
    // Replace multiple consecutive hyphens with a single hyphen
    transformedSlug = transformedSlug.replace(/--+/g, '-')
    // Trim leading/trailing hyphens
    transformedSlug = transformedSlug.replace(/^-+|-+$/g, '')
    return transformedSlug
  })
  .pipe(
    z
      .string()
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Transformed slug must be lowercase, alphanumeric, and use hyphens for spaces. No consecutive hyphens, leading/trailing hyphens, or special characters.',
      )
      .refine(
        (s) => !s.includes('--'),
        'Transformed slug cannot contain consecutive hyphens.',
      ), // Redundant due to transform, but good as a final check.
  )

export type SlugParamSchema = z.infer<typeof slugParamSchema>
