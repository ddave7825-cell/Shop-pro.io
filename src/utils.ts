/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

/**
 * Formats a number price into West/Central African CFA Franc (FCFA) format.
 * E.g., 545000 -> "545 000 FCFA"
 */
export const formatPrice = (price: number): string => {
  return typeof price === 'number'
    ? price.toLocaleString('fr-FR') + ' FCFA'
    : '0 FCFA';
};
