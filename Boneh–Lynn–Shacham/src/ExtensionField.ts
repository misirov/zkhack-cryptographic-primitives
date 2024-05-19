
export { createExtensionField, BaseExtensionField };

class BaseExtensionField {

  static _modulus: bigint | undefined = undefined;
  static _degree: number | undefined = undefined;
  static _modulusPoly: bigint[] | undefined = undefined;

  static get modulus(): bigint {
    if (this._modulus === undefined) {
      throw new Error('modulus not set');
    }
    return this._modulus;
  }

  static get degree(): number {
    if (this._degree === undefined) {
      throw new Error('degree not set');
    }
    return this._degree;
  }

  static get modulusPoly(): bigint[] {
    if (this._modulusPoly === undefined) {
      throw new Error('modulusPoly not set');
    }
    return this._modulusPoly;
  }

  
  get modulus() {
    return (this.constructor as typeof BaseExtensionField).modulus;
  }

  value: bigint[];  

  get Constructor() {
    return this.constructor as typeof BaseExtensionField;
  }

  constructor(x: BaseExtensionField | bigint[] | number[]) {
    const p = this.modulus;
    if (x instanceof BaseExtensionField) {
      this.value = x.value;
      return;
    }

    if (Array.isArray(x)) {
      if (x.every(item => typeof item === 'bigint')) {
        this.value = (x as bigint[]).map((y) => y % p);
      } else if (x.every(item => typeof item === 'number')) {
        this.value = (x as number[]).map((y) => BigInt(y) % p);
      }
      return;
    }
  }

}


function createExtensionField(modulus: bigint, polynomialModulus: bigint[]): typeof BaseExtensionField {

  class ExtensionField extends BaseExtensionField {
    static _modulus: bigint = modulus;
    static _degree: number = polynomialModulus.length;
    static _modulusPoly: bigint[] = polynomialModulus;

  }

  return ExtensionField;
}