// Functional Programming utils
import * as R from 'ramda';

export const trace = R.curry((label: string, value: any) => {
  console.log(`${label}: `, value);
  return value;
});
