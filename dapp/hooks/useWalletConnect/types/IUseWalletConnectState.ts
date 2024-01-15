import { SessionTypes } from '@walletconnect/types';

interface IUseWalletConnectState {
  connect: () => Promise<SessionTypes.Struct>;
}

export default IUseWalletConnectState;
