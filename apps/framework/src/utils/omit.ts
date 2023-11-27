/**
 * Define a generic function `omit` that takes an object and
 * an array of properties to omit.
 * @param obj
 * @param props
 * @returns newObj
 */
export const omit = <T extends Record<string, unknown>>(obj: T, props: string[]): T => {
  // Throw an error if `obj` is null or undefined.
  if (obj == null) {
    throw new Error('obj must not be null or undefined');
  }

  // Throw an error if `props` is not an array.
  if (!Array.isArray(props)) {
    throw new Error('props must be an array');
  }

  // Throw an error if `props` contains any non-string values.
  if (props.some(prop => typeof prop !== 'string')) {
    throw new Error('props must only contain strings');
  }

  // Create a shallow copy of `obj` and treat it as a Record<string, unknown>.
  const newObj = { ...obj } as Record<string, unknown>;

  // Create a new array of `props` with duplicates removed.
  const uniqueProps = [...new Set(props)];

  // Iterate over each property in `uniqueProps`.
  uniqueProps.forEach(prop => {
    // If `prop` includes a period, it's a nested property.
    if (prop.includes('.')) {
      // Split `prop` into the first property and the rest of the properties.
      const [firstProp, ...restProps] = prop.split('.');

      // If `newObj` has the first property, call `omit` recursively on the nested object and the rest of the properties.
      if (typeof newObj[firstProp] === 'object' && newObj[firstProp] !== null) {
        newObj[firstProp] = omit(newObj[firstProp] as Record<string, unknown>, restProps);
      }
    } else {
      // If `prop` does not include a period, delete it from `newObj`.
      delete newObj[prop];
    }
  });

  // Return `newObj` as `T`.
  return newObj as T;
};