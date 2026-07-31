import { describe, expect, test } from 'bun:test';

import { parseSurveySubmission } from './commercial-model-survey.ts';

const validSubmission = {
  usage: 'production',
  priorities: ['features', 'fixes'],
  response: 'agree',
  opinion: '',
  website: '',
  surveyVersion: '2026-07-30',
};

describe('parseSurveySubmission', () => {
  test('accepts a valid agreement response', () => {
    expect(parseSurveySubmission(validSubmission)).toEqual({
      ...validSubmission,
      opinion: null,
      isBot: false,
    });
  });

  test('requires a written opinion when the respondent disagrees', () => {
    expect(() => parseSurveySubmission({ ...validSubmission, response: 'opinion', opinion: '   ' })).toThrow();
  });

  test('rejects invalid or excessive development priorities', () => {
    expect(() => parseSurveySubmission({ ...validSubmission, priorities: ['features', 'fixes', 'docs', 'audit'] })).toThrow();
  });

  test('marks a filled honeypot as a bot without retaining its value', () => {
    expect(parseSurveySubmission({ ...validSubmission, website: 'https://spam.example' })).toEqual({
      ...validSubmission,
      opinion: null,
      website: '',
      isBot: true,
    });
  });
});
