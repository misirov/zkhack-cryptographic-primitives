import {
    Crypto,
    createForeignCurve
} from "o1js";

export { AltBn128 };

/* Alt BN128 parameters. See https://cryptojedi.org/papers/pfcpo.pdf

The Alt BN128 curve has the following Short-Weierstrass form:

y^2 = x^3 + 3.

It has embedding degree of 12 and is defined over the field generated by 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47

AZTEC implementation https://raw.githubusercontent.com/AztecProtocol/AZTEC/master/AZTEC.pdf

Sage reference to generate this curve: https://github.com/scipr-lab/libff/blob/674e437446216ade040194105b4fc9ff3d8db6f1/libff/algebra/curves/alt_bn128/alt_bn128.sage

Also check out this python implementation for eth: https://github.com/ethereum/py_pairing/tree/master/py_ecc/bn128
*/


const alt_bn128Params: Crypto.CurveParams = {
  name: 'BN254',
  modulus: 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47n,
  order: 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001n,
  a: 0n,
  b: 3n,
  generator: {
    x: 1n, 
    y: 2n,
  },
};

class AltBn128 extends createForeignCurve(alt_bn128Params) {};

