import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import Params from '../../abi/chainParams';

export const injected = new InjectedConnector({ supportedChainIds: [43113,43114] })
export const walletconnect = new WalletConnectConnector({
   rpcUrl: Params.rpcUrls[0],
   bridge: "https://bridge.walletconnect.org",
   qrcode: true
});