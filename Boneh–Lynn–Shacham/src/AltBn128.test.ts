
import { AltBn128 } from './AltBn128';

describe('test AltBn128 curve', function() {

  it('Generator doubling', function() {
    console.log("Add two times the generator");
    let x = new AltBn128({x: 1n, y: 2n});
    let y = new AltBn128({
      x: 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd3n,
      y: 0x15ed738c0e0a7c92e7845f96b2ae9c0a68a6a449e3538fc7ff3ebf7a5a18a2c4n});
    let z = x.add(x);
    z.x.assertEquals(y.x);
    z.y.assertEquals(y.y);
  });

});