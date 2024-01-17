import { SessionTypes } from '@walletconnect/types';

// types
import { IArc0001SignTxns } from '@common/types';

interface IUseWalletConnectState {
  connect: () => Promise<SessionTypes.Struct>;
  signTransactions: (txns: IArc0001SignTxns[]) => Promise<void>;
}

export default IUseWalletConnectState;
