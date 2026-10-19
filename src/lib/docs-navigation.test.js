import { expect, test } from 'bun:test';
import { verifyCommercialNavigation } from '../../scripts/check-navigation.mjs';

test('commercial sidebar groups expose every page once without hidden package roots', () => {
  const navigation = verifyCommercialNavigation();
  expect(navigation.groups).toBe(6);
  expect(navigation.pages).toBeGreaterThan(30);
});
