
import { ethers } from 'ethers';

/**
 * Modern cryptographic utility for envelope links.
 */
export class EnvelopeEncryption {
  /**
   * Generates a secure random secret (256-bit).
   */
  static generateSecret(): string {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return ethers.hexlify(array);
  }

  /**
   * Generates a Keccak256 hash of the secret for on-chain storage.
   */
  static generateHash(secret: string): string {
    return ethers.id(secret);
  }

  /**
   * Encodes a secret into a URL-safe base64 string.
   */
  static encodeLink(secret: string): string {
    return btoa(secret).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  /**
   * Decodes a secret from a URL-safe base64 string.
   */
  static decodeLink(encoded: string): string {
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    return atob(base64);
  }
}
