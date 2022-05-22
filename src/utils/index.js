import { getAddress } from '@ethersproject/address';

import metamaskIcon from '../assets/img/metamask.png';
import walletconnectIcon from '../assets/img/walletConnectIcon.svg';
import injectedIcon from '../assets/img/arrow-right.svg';

export function isAddress(value) {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address, chars = 4) {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

const ETHERSCAN_PREFIXES = {
  1: '',
  3: 'ropsten.',
  4: 'rinkeby.',
  5: 'goerli.',
  42: 'kovan.',
  43114: 'snowtrace.'
};

export function getEtherscanLink(chainId, data, type) {
  const prefix = `https://snowtrace.io`

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'token': {
      return `${prefix}/token/${data}`
    }
    case 'block': {
      return `${prefix}/block/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

export function getWalletIcon(wallet) {
  switch (wallet) {
    case 'metamask':
      return metamaskIcon;
    case 'walletconnect':
      return walletconnectIcon;
    case 'injected':
    default:
      return injectedIcon;
  }
}
