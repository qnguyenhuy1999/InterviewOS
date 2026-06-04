import { z } from 'zod'

export const readinessSnapshotSchema = z.object({
  overallScore: z.number().int().min(0).max(100),
  confidenceLevel: z.number().min(0).max(1),
  breakdown: z.array(
    z.object({
      dimension: z.string().min(1),
      score: z.number().min(0).max(100),
      weight: z.number().min(0).max(1),
      label: z.string().min(1),
      trend: z.enum(['UP', 'DOWN', 'STABLE']),
    }),
  ),
  improvementAreas: z.array(z.string().min(1)),
})
