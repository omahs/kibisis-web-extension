// types
import { IArc0001SignTxns } from '@common/types';
import { INetwork } from '@extension/types';

type ISignTransactionViaWalletConnectFunction = (
  txns: IArc0001SignTxns[],
  network: INetwork
) => Promise<Uint8Array[]>;

export default ISignTransactionViaWalletConnectFunction;
