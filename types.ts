
export enum AppView {
  HOME = 'home',
  CREATE = 'create',
  CLAIM = 'claim',
  HISTORY = 'history'
}

export interface EnvelopeData {
  id: string; // Hash of the secret
  secret: string;
  creator: string;
  token: string;
  amount: string;
  expiresAt: number;
  claimed: boolean;
  claimedBy?: string;
  message?: string;
  createdAt: number;
}

export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  explorer: string;
  symbol: string;
}
