# Cryptographic Primitives Implementation with `O1.js`

This repository contains two cryptographic primitives which can be further developed for the o1.js library.
- BLS
- Shamir Secret Sharing

## BLS

BLS (Boneh–lynn–shacham) signature scheme is a digital signature scheme that is based on elliptic curve cryptography. This repository shows the attempt of trying to implement the BLS signature using `o1js`. The basic ingredients are:

- Elliptic curve groups $\mathbb{G}_1$, $\mathbb{G}_2$ and $\mathbb{G}_T$ (with their corresponding generators $g_1$, $g_2$ and $g_T$).
- A random number $x$ that will be used as the private key.
- A hash function $h$.
- A bilinear pairing $e$.

### Schema overview

1. Generate a random number $x$.
2. Compute the public key $g_1^x$.
3. Sign a message $m$ by computing $h(m)^x$.
4. Verify the signature by checking if $e(h(m)^x,g_1) = e(h(m), g_1^x)$.

##### Elliptic curve

For BLS, the elliptic curve that is canonically used is the BLS12-381 curve, so our first step consisted in creating this elliptic curve object via the API exposed by `o1js`. However, we found that the API does not allow for the creation of curves whose base field is greater than 256 bits. Hence, we had to choose a different curve. _Furthermore we noticed that the `BLS12_381` parameters provided in the curve examples parameters for `o1js` was not correct, so we opened a [pull request fixing this](https://github.com/o1-labs/o1js-bindings/pull/275)._

The chosen alternative was AltBN128 (the same curve used for zkSnarks in Ethereum) because it is a pairing friendly curve that can be defined by `o1js`. Using the `o1js` API, we created the elliptic curve object as follows:

```ts
import {
    Crypto,
    createForeignCurve
} from "o1js";

export { AltBn128 };

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
```

The next step was to create the elliptic curve groups $\mathbb{G}_1$, $\mathbb{G}_2$ and $\mathbb{G}_T$ (with their corresponding generators $g_1$, $g_2$ and $g_T$).

In the case of BLS12-381, $\mathbb{G}_1$ is the greatest prime order subgroup of the curve (because it happens that BLS12-381 has a cofactor different than 1, but great enough so that $\mathbb{G}_1$ is cryptographically secure). However, in the case of AltBN128, the curve has a cofactor of 1, so $\mathbb{G}_1$ is the whole curve. For AltBN128, we use the generator $g_1$ is the point $(1, 2)$.

For $\mathbb{G}_2$, we use the elliptic curve group over by the field extension of $\mathbb{F}_p$ to $\mathbb{F}_{p^2}$ where $p$ is prime the modulus corresponding to AltBN128. So, before attempting to create the elliptic curve group $\mathbb{G}_2$, we need to create the field extension $\mathbb{F}_{p^2}$.

The field extension $\mathbb{F}_{p^2}$ consists of the set of elements of the form $ax^2 + bx + c$, with $a, b, c \in \mathbb{F}_p$, where the coefficients are subjected to modular arithmetic with respect to modulus $p$, and the product (and inverses) of the polynomial elements are subjected to modulo irreducible polynomial $x^2 + 1$.

As far as we know, there is no direct way to create the field extension $\mathbb{F}_{p^2}$ using the `o1js` API. So we attempted to create our custom class for this [see this incomplete source code](./Boneh–Lynn–Shacham/src/Extension_extension.ts) by considering arrays of the form `[a, b]` as the elements of $\mathbb{F}_{p^2}$.

And basically here is where we had to stop (due to time constraints).

The idea was then to extend the `o1js` base class for elliptic curve so that it worked with extension fields... But that would have been a feat itself.

The next group, $\mathbb{G}_T$ is the target group of the bilinear pairing, which is a curve defined over the extension field $\mathbb{F}_{p^{12}}$. Since this field has a large number of elements, specifically $\left|\mathbb{F}_{p^{12}}\right|=\left|\mathbb{F}_{p}\right|^{12}=p^{12}$, one usually uses extension field towers to represent the elements of $\mathbb{F}_{p^{12}}$ as elements of $\mathbb{F}_{p^2}$.

Then, it would also be necessary to define [curve twists](https://en.wikipedia.org/wiki/Twists_of_elliptic_curves) (by some custom class) so that the bilinear pairing could be computed efficiently...

And finally we'd have to compute the pairing itself (the optimal Ate Pairing which requires computing roots of unity...). Most of these steps are not trivial, require some advanced understanding of elliptic curve cryptography and unfortunately aren't yet supported by the current `o1js` API.

#### References

Understanding the pitfalls of implementing BLS was a key element for this project. The following references were used:

#### `o1js` library
- [`o1js` docs](https://docs.minaprotocol.com/zkapps/o1js)

#### Elliptic curve database

- [Elliptic Curve Database](https://neuromancer.sk/std/)

#### BLS

- [Wikipedia BLS Digital Signature](https://en.wikipedia.org/wiki/BLS_digital_signature)
- [Attractive Subfamilies of BLS Curves for Implementing High-Security Pairings](https://eprint.iacr.org/2011/465.pdf)
- [Stanford Cryptography BLS curves](https://crypto.stanford.edu/pbc/notes/ep/bls2002.html)
- [Pairing-friendly curves at the 128-bit security level](https://members.loria.fr/AGuillevic/pairing-friendly-curves/#pairing-friendly-curves-at-the-128-bit-security-level)
- [BLS12-381 _for the rest of us_](https://hackmd.io/@benjaminion/bls12-381#fnref8)


#### AltBN128 curve

- [Aztec Yellowpaper](https://raw.githubusercontent.com/AztecProtocol/AZTEC/master/AZTEC.pdf)
- [Ethereum AltBN128 Ecc](https://github.com/ethereum/py_pairing/tree/master/py_ecc/bn128)
- [BN254 _for the rest of us_](https://hackmd.io/@jpw/bn254)
- [Co-factor clearing and subgroup membership testing on pairing-friendly curves](https://inria.hal.science/hal-03608264/document)

#### Elliptic curve groups based on polynomials over extension fields

- [Polynomials and Elliptic Curves over Extension Fields](https://risencrypto.github.io/ExtensionFields/)

## Shamir Secret Sharing Proofs

Shamir's Secret Sharing is a cryptographic technique for dividing a $secret$ into $shares$ distributed among participants. The $secret$ can only be reconstructed when at least a threshold $k$ of these $shares$ are combined.

The main idea resides in the construction of a polynomial of degree $k-1$ where the secret is encoded as the 0th coefficient

$$
f(x) = a_0 + a_1 x + a_2 x^2 + \cdots + a_{k-1} x^{k-1}
$$

and shares are created by computing $(i, f(i)$. The secret (0th coeffient) can be reconstructed given $k$ shares by using Lagrange Interpolation

$$
f(0) = \sum_{j=0}^{k-1} y_j \prod_{\substack{m=0 \\ m \ne j}}^{k-1} \frac{x_m}{x_m - x_j}
$$

Using `O1.js`, a zero-knowledge proof can be generated during the creation of each share, allowing share holders to prove their ownership without reconstructing the secret. This is particularly useful for verifying the authenticity of shares, especially for users with significant roles or influence, and therefore prevent fake share ownership claims.

### Run Project

- `npm run build`
- `node build/src/ShamirSecret.js`

### Proof Of Concept implementation
- Chose a secret work or sentence, transform it into its ascii representation typed to number
```js
// Create secret
const secret = "BOBER";
// Convert string to ascii numbers
const asciiNumbers = stringToAsciiNumber(secret);
console.log(`secret '${secret}' to number: ${asciiNumbers}`);
```

- Compute polynomial and return points
```js
// Shares to break secret into
const k = 3;
// Compute polynomial and return points in plane
const points = generatePoints(asciiNumbers, k);
```

- Theoretical POC: Shares are encoded and the proof of generation is also returned. Each share is linked to a proof which can be passed to a `verifyShareProof()` function to prove that a user with a share also has its respective proof.
```js
// Encode points into Base64 to represent shares
const encodedShares, proofs = encodeShares(points);

// Verify that user holds a real share by computing the proof
bool result = verifyShareProof(proofs);
result.assert(true);

// Decode shares and use Lagrange Interpolation to retrieve points 
const retrievedPoints = decodeShares(encodedShares, proofs);

const reconstructedSecret = reconstructSecret(retrievedPoints, k);
console.log(`Reconstructed secret: ${reconstructedSecret.toString()}`);
```

#### References
- [Lagrange Interpolation Formula](https://www.pw.live/exams/school/lagrange-interpolation-formula/)
- [Splitting a Secret by Mozilla](https://github.com/getsops/sops/tree/main/shamir#splitting-a-secret)
- [Shamir Secrets](https://github.com/adviksinghania/shamir-secret-sharing)
- [ThresholdJS/](http://karlgluck.github.io/ThresholdJS/)
