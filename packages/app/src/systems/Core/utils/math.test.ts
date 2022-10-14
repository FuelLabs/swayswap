import { bn } from 'fuels';

import * as math from './math';

describe('Math utilities', () => {
  it('Math.multiply', () => {
    expect(math.multiply(bn(100), 1.2).toHex()).toEqual(bn(120).toHex());
    expect(math.multiply(bn(2), 0.5).toHex()).toEqual(bn(1).toHex());
    expect(math.multiply(bn('100000020000'), 0.5).toHex()).toEqual(bn('50000010000').toHex());
  });

  it('Math.divide', () => {
    expect(math.divide(bn(4), bn(2)).toHex()).toEqual(bn(2).toHex());
    expect(math.divide(bn(1), 0.5).toHex()).toEqual(bn(2).toHex());
    expect(math.divide(bn('100000020000'), 0.5).toHex()).toEqual(bn('200000040000').toHex());
  });

  it('Math.minimumZero', () => {
    expect(math.minimumZero('-2').toHex()).toEqual(math.ZERO.toHex());
  });

  it('Math.maxAmount', () => {
    expect(math.maxAmount(bn(1), bn(2)).toHex()).toEqual(bn(2).toHex());
  });

  it('Math.isValidNumber', () => {
    expect(math.isValidNumber(bn('0xFFFFFFFFFFFFFFFF'))).toBeTruthy();
    expect(math.isValidNumber(bn('0x1FFFFFFFFFFFFFFFF'))).toBeFalsy();
  });
});
