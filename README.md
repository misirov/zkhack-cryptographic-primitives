# Cryptographic Primitives Implementation on O1.js

This repository contains two cryptographic primitives which can be further developed for the o1.js library.

## BLS

...

## Shamir Secret Sharing

### Lagrange Interpolation


$$
\[ P(x) = \sum_{i=0}^{k-1} y_i \cdot l_i(x) \]
$$

$$
\[ l_i(x) = \prod_{\substack{0 \le j < k \\ j \ne i}} \frac{x - x_j}{x_i - x_j} \]
$$

$$
\[ l_i(x) = \prod_{\substack{0 \le j < k \\ j \ne i}} \frac{x - x_j}{x_i - x_j} \]
$$

$$
\[ P(x) = \sum_{i=0}^{k-1} y_i \cdot l_i(x) \]
$$

$$
\[ P(0) = \sum_{i=0}^{k-1} y_i \cdot l_i(0) \]
$$
where
$$
\[ l_i(0) = \prod_{\substack{0 \le j < k \\ j \ne i}} \frac{0 - x_j}{x_i - x_j} = \prod_{\substack{0 \le j < k \\ j \ne i}} \frac{-x_j}{x_i - x_j} \]
$$