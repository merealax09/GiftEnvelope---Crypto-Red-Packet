
import { NetworkConfig } from './types';

export const NETWORKS: Record<string, NetworkConfig> = {
  baseSepolia: {
    chainId: 84532,
    name: 'Base Sepolia',
    rpcUrl: 'https://sepolia.base.org',
    explorer: 'https://sepolia.basescan.org',
    symbol: 'ETH',
  },
  baseMainnet: {
    chainId: 8453,
    name: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    explorer: 'https://basescan.org',
    symbol: 'ETH',
  },
};

export const DEFAULT_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'; // Mock address for UI demo
