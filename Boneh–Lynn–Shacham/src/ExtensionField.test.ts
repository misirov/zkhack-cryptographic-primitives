
import { createExtensionField } from './ExtensionField';

describe('test Extension Field', function() {

  it('Create Extension Field', function() {
    let ExtensionFieldDeg2 = createExtensionField(2n, [1n, 0n, 1n]); // x^4 + x + 1 (the + 1 is assumed in the impl)
    let x = new ExtensionFieldDeg2([1n, 2n]);
    console.log(x.value);
  });

});