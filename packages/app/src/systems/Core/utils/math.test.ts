import { bn } from 'fuels';

import * as math from './math';

describe('Math utilities', () => {
  it('Math.parseUnits', () => {
    expect(math.parseUnits('1').toHex()).toEqual(bn('1000000000').toHex());
    expect(math.parseUnits('0.000000002').toHex()).toEqual(bn(2).toHex());
    expect(math.parseUnits('0.00002').toHex()).toEqual(bn('20000').toHex());
    expect(math.parseUnits('100.00002').toHex()).toEqual(bn('100000020000').toHex());
    expect(math.parseUnits('100,100.00002').toHex()).toEqual(bn('100100000020000').toHex());
  });
  it('Math.formatUnits', () => {
    expect(math.formatUnits(bn('1000000000'))).toEqual('1.000000000');
    expect(math.formatUnits(bn('2'))).toEqual('0.000000002');
    expect(math.formatUnits(bn('20000'))).toEqual('0.000020000');
    expect(math.formatUnits(bn('100000020000'))).toEqual('100.000020000');
    expect(math.formatUnits(bn('100100000020000'))).toEqual('100100.000020000');
  });

  it('Math.format', () => {
    expect(math.format(bn('399999988'))).toEqual('0.399');
    expect(math.format(bn('1399999988'))).toEqual('1.399');
    expect(math.format(bn('1399999988'))).toEqual('1.399');
    expect(math.format(bn('3900'))).toEqual('0.000003');
    expect(math.format(bn('1000003900'))).toEqual('1.000');
    expect(math.format(bn('100000020000'))).toEqual('100.000');
    expect(math.format(bn('100100000020000'))).toEqual('100,100.000');
    expect(math.format(bn('100100100000020000'))).toEqual('100,100,100.000');
  });

  it('Math.isZero', () => {
    expect(math.isZero('0')).toBeTruthy();
    expect(math.isZero(bn(0))).toBeTruthy();
  });

  it('Math.divideBy', () => {
    expect(math.multiply(bn(100), 1.2).toHex()).toEqual(bn(120).toHex());
    expect(math.multiply(bn(2), 0.5).toHex()).toEqual(bn(1).toHex());
    expect(math.divide(bn(4), bn(2)).toHex()).toEqual(bn(2).toHex());
    expect(math.divide(bn(1), 0.5).toHex()).toEqual(bn(2).toHex());
    expect(math.multiply(bn('100000020000'), 0.5).toHex()).toEqual(bn('50000010000').toHex());
    expect(math.divide(bn('100000020000'), 0.5).toHex()).toEqual(bn('200000040000').toHex());
  });

  it('Math.minimumZero', () => {
    expect(math.minimumZero('-2').toHex()).toEqual(math.ZERO.toHex());
  });

  it('Math.maxAmount', () => {
    expect(math.maxAmount(bn(1), bn(2)).toHex()).toEqual(bn(2).toHex());
  });

  it('Math.safeBigInt', () => {
    expect(math.safeBigInt().toHex()).toEqual(math.ZERO.toHex());
  });

  it('Math.isValidNumber', () => {
    expect(math.isValidNumber(bn('0xFFFFFFFFFFFFFFFF'))).toBeTruthy();
    expect(math.isValidNumber(bn('0x1FFFFFFFFFFFFFFFF'))).toBeFalsy();
  });
});
