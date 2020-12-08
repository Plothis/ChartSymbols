import { ChartSymbols } from '../src/index';

test('index', () => {
  const symbolTypes = Object.keys(ChartSymbols);
  // tslint:disable-next-line: no-console
  console.log(symbolTypes.toString());
  expect(symbolTypes.includes('treemap')).toBe(true);
});
