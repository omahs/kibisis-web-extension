import { encode as encodeBase64 } from '@stablelib/base64';

// types
import { ISignTransactionViaUseWalletFunction } from '../types';

export default async function useWalletSignTxns(
  signTransactionsFunction: ISignTransactionViaUseWalletFunction,
  indexesToSign: number[],
  encodedTxns: Uint8Array[]
): Promise<(string | null)[]> {
  const result: Uint8Array[] = await signTransactionsFunction(
    encodedTxns,
    indexesToSign,
    true
  );

  return result.map((value) => encodeBase64(value));
}
