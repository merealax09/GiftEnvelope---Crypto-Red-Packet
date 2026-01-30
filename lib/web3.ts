
import { ethers } from 'ethers';
import { NETWORKS } from '../constants';

/**
 * Fix: Augment the global Window interface to include the ethereum property,
 * which is injected by Web3 provider extensions like MetaMask.
 */
declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error('Please install a Web3 wallet (e.g., MetaMask)');
  }

  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });

  return accounts[0];
}

export async function checkNetwork(chainId: number) {
  const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
  return parseInt(currentChainId, 16) === chainId;
}

export async function switchToBase() {
  const network = NETWORKS.baseSepolia; // Default to Sepolia for safety
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${network.chainId.toString(16)}` }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${network.chainId.toString(16)}`,
            chainName: network.name,
            rpcUrls: [network.rpcUrl],
            blockExplorerUrls: [network.explorer],
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18,
            },
          },
        ],
      });
    }
  }
}
