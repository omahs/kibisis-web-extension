import { SessionTypes } from '@walletconnect/types';

/**
 * @property {number} expiresAt - a timestamp (in milliseconds) for when this session was expires.
 * @property {SessionTypes.Namespaces} namespaces - the namespaces available for this session.
 * @property {string} pairingTopic - the WalletConnect pairing topic for this session. This is used when a pairing
 * already exists.
 * @property {string} topic - the WalletConnect topic for this session.
 */
interface IWalletConnectSessionMetadata {
  expiresAt: number;
  namespaces: SessionTypes.Namespaces;
  pairingTopic: string;
  topic: string;
}

export default IWalletConnectSessionMetadata;
