type ISignTransactionViaUseWalletFunction = (
  transactions: Uint8Array[] | Uint8Array[][],
  indexesToSign?: number[] | undefined,
  returnGroup?: boolean | undefined
) => Promise<Uint8Array[]>;

export default ISignTransactionViaUseWalletFunction;
