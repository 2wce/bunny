import { describe, expect, it } from 'vitest';
import { omit } from '../omit';

describe('omit', () => {
  // Test 1: Check if function throws an error when obj is null or undefined
  it('throws an error when obj is null or undefined', () => {
    // @ts-expect-error
    expect(() => omit(null, ['prop'])).toThrow('obj must not be null or undefined');
    // @ts-expect-error
    expect(() => omit(undefined, ['prop'])).toThrow('obj must not be null or undefined');
  });

  // Test 2: Check if function throws an error when props is not an array
  it('throws an error when props is not an array', () => {
    // @ts-expect-error
    expect(() => omit({}, 'prop')).toThrow('props must be an array');
  });

  // Test 3: Check if function throws an error when props contains non-string values
  it('throws an error when props contains non-string values', () => {
    // @ts-expect-error
    expect(() => omit({}, [1])).toThrow('props must only contain strings');
  });

  // Test 4: Check if function correctly removes properties
  it('removes properties from obj', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(omit(obj, ['a', 'b'])).toEqual({ c: 3 });
  });

  // Test 5: Check if function correctly removes nested properties
  it('removes nested properties from obj', () => {
    const obj = { a: { b: 2 }, c: 3 };
    expect(omit(obj, ['a.b'])).toEqual({ a: {}, c: 3 });
  });

  // Test 6: Check if function does not modify the original object
  it('does not modify the original object', () => {
    const obj = { a: 1, b: 2, c: 3 };
    omit(obj, ['a', 'b']);
    expect(obj).toEqual({ a: 1, b: 2, c: 3 });
  });
});