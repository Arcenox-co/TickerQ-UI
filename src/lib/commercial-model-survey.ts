import { z } from 'zod';

export const surveyUsageValues = [
  'production',
  'pilot',
  'evaluating',
  'not-yet',
] as const;

export const surveyPriorityValues = [
  'features',
  'fixes',
  'integrations',
  'reliability',
  'dashboard',
  'docs',
] as const;

const surveySubmissionSchema = z
  .object({
    usage: z.enum(surveyUsageValues),
    priorities: z
      .array(z.enum(surveyPriorityValues))
      .min(1)
      .max(3)
      .refine((values) => new Set(values).size === values.length, {
        message: 'Priorities must be unique',
      }),
    response: z.enum(['agree', 'opinion']),
    opinion: z.string().trim().max(4000).optional().default(''),
    website: z.string().max(500).optional().default(''),
    surveyVersion: z.string().trim().min(1).max(40),
  })
  .superRefine((submission, context) => {
    if (submission.response === 'opinion' && !submission.opinion) {
      context.addIssue({
        code: 'custom',
        path: ['opinion'],
        message: 'Please share your opinion',
      });
    }
  })
  .transform((submission) => ({
    ...submission,
    opinion: submission.response === 'opinion' ? submission.opinion : null,
    website: '',
    isBot: Boolean(submission.website),
  }));

export type SurveySubmission = z.infer<typeof surveySubmissionSchema>;

export function parseSurveySubmission(input: unknown): SurveySubmission {
  return surveySubmissionSchema.parse(input);
}
