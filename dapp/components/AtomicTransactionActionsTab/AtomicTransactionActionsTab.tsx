import { BaseError } from '@agoralabs-sh/algorand-provider';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Code,
  CreateToastFnReturn,
  Divider,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  TabPanel,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
  VStack,
} from '@chakra-ui/react';
import {
  decode as decodeBase64,
  encode as encodeBase64,
} from '@stablelib/base64';
import { encode as encodeHex } from '@stablelib/hex';
import { useWallet } from '@txnlab/use-wallet';
import {
  assignGroupID,
  computeGroupID,
  decodeSignedTransaction,
  encodeUnsignedTransaction,
  SignedTransaction,
  Transaction,
} from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { FC, useEffect, useState } from 'react';

// components
import ConnectionNotInitializedContent from '../ConnectionNotInitializedContent';

// enums
import { TransactionTypeEnum } from '@extension/enums';
import { ConnectionTypeEnum } from '../../enums';

// theme
import { theme } from '@extension/theme';

// types
import { INetwork } from '@extension/types';
import { IWindow } from '@external/types';
import { IAccountInformation, IAssetInformation } from '../../types';

// utils
import convertToAtomicUnit from '@common/utils/convertToAtomicUnit';
import convertToStandardUnit from '@common/utils/convertToStandardUnit';
import formatCurrencyUnit from '@common/utils/formatCurrencyUnit';
import {
  algorandProviderSignTxns,
  createAppCallTransaction,
  createAssetTransferTransaction,
  createPaymentTransaction,
  useWalletSignTxns,
} from '../../utils';

interface IAssetValue extends IAssetInformation {
  amount: BigNumber;
  isChecked: boolean;
}
interface IProps {
  account: IAccountInformation | null;
  connectionType: ConnectionTypeEnum | null;
  network: INetwork | null;
}

const AtomicTransactionActionsTab: FC<IProps> = ({
  account,
  connectionType,
  network,
}: IProps) => {
  const toast: CreateToastFnReturn = useToast({
    duration: 3000,
    isClosable: true,
    position: 'top',
  });
  const { signTransactions } = useWallet();
  // states
  const [assetValues, setAssetValues] = useState<IAssetValue[]>([]);
  const [groupId, setGroupId] = useState<string>('N/A');
  const [includeApplicationCall, setIncludeApplicationCall] =
    useState<boolean>(false);
  const [signedTransactions, setSignedTransactions] = useState<
    (SignedTransaction | null)[]
  >([]);
  // handlers
  const handleAmountChange = (assetId: string) => (valueAsString: string) => {
    setAssetValues(
      assetValues.map((value) => {
        let amount: BigNumber;
        let maximumAmount: BigNumber;

        if (value.id !== assetId) {
          return value;
        }

        amount = new BigNumber(valueAsString);
        maximumAmount = convertToStandardUnit(value.balance, value.decimals);

        return {
          ...value,
          amount: amount.gt(maximumAmount) ? maximumAmount : amount,
        };
      })
    );
  };
  const handleAssetCheckChange = (assetId: string) => () => {
    setAssetValues(
      assetValues.map((value) =>
        value.id === assetId
          ? {
              ...value,
              isChecked: !value.isChecked,
            }
          : value
      )
    );
  };
  const handleIncludeApplicationCallCheckChange = () =>
    setIncludeApplicationCall(!includeApplicationCall);
  const handleSignAtomicTransactionsClick = async () => {
    let assetValue: IAssetValue;
    let computedGroupId: string;
    let result: (string | null)[] | null = null;
    let unsignedAppTransaction: Transaction | null;
    let unsignedTransactions: Transaction[];

    if (!account || !connectionType || !network) {
      toast({
        description: 'You must first enable the dApp with the wallet.',
        status: 'error',
        title: 'No Account Not Found!',
      });

      return;
    }

    try {
      unsignedTransactions = [];

      for (let i: number = 0; i < assetValues.length; i++) {
        assetValue = assetValues[i];

        if (!assetValue.isChecked) {
          continue;
        }

        // if we have algorand, use a payment transaction
        if (assetValue.id === '0') {
          unsignedTransactions.push(
            await createPaymentTransaction({
              amount: convertToAtomicUnit(
                assetValue.amount,
                assetValue.decimals
              ),
              from: account.address,
              network,
              note: null,
              to: null,
            })
          );

          continue;
        }

        unsignedTransactions.push(
          await createAssetTransferTransaction({
            amount: convertToAtomicUnit(assetValue.amount, assetValue.decimals),
            assetId: assetValue.id,
            from: account.address,
            network,
            note: null,
            to: null,
          })
        );
      }

      // include the app call if checked
      if (includeApplicationCall) {
        unsignedAppTransaction = await createAppCallTransaction({
          from: account.address,
          network,
          note: null,
          type: TransactionTypeEnum.ApplicationNoOp,
        });

        if (unsignedAppTransaction) {
          unsignedTransactions.push(unsignedAppTransaction);
        }
      }

      computedGroupId = encodeBase64(computeGroupID(unsignedTransactions));
      unsignedTransactions = assignGroupID(unsignedTransactions);

      switch (connectionType) {
        case ConnectionTypeEnum.AlgorandProvider:
          result = await algorandProviderSignTxns(unsignedTransactions);

          if (!result) {
            toast({
              description:
                'Algorand Provider has been intialized; there is no supported wallet.',
              status: 'error',
              title: 'window.algorand Not Found!',
            });

            return;
          }

          break;
        case ConnectionTypeEnum.UseWallet:
          result = await useWalletSignTxns(
            signTransactions,
            unsignedTransactions.map((_, index) => index),
            unsignedTransactions.map((value) =>
              encodeUnsignedTransaction(value)
            )
          );

          break;
        default:
          break;
      }

      if (result) {
        toast({
          description: `Successfully signed atomic transactions for provider "${connectionType}".`,
          status: 'success',
          title: 'Atomic Transactions Signed!',
        });

        setGroupId(computedGroupId);
        setSignedTransactions(
          result.map((value) =>
            value ? decodeSignedTransaction(decodeBase64(value)) : null
          )
        );
      }
    } catch (error) {
      toast({
        description: (error as BaseError).message,
        status: 'error',
        title: `${(error as BaseError).code}: ${(error as BaseError).name}`,
      });

      setGroupId('N/A');
      setSignedTransactions([]);
    }
  };
  // renders
  const renderContent = () => {
    if (!connectionType) {
      return <ConnectionNotInitializedContent />;
    }

    return (
      <VStack justifyContent="center" spacing={8} w="full">
        {/*signed transactions table*/}
        <TableContainer
          borderColor="gray.200"
          borderRadius={15}
          borderStyle="solid"
          borderWidth={1}
          w="full"
        >
          <Table variant="simple">
            <TableCaption>Group ID: {groupId}</TableCaption>
            <Thead>
              <Tr>
                <Th>Txn ID</Th>
                <Th>Signature (hex)</Th>
              </Tr>
            </Thead>
            <Tbody>
              {signedTransactions.map((value, index) => (
                <Tr key={`atomic-transaction-action-item-${index}`}>
                  <Td>
                    <Code fontSize="sm" wordBreak="break-word">
                      {value ? value.txn.txID() : 'unsigned'}
                    </Code>
                  </Td>
                  <Td>
                    <Code fontSize="sm" wordBreak="break-word">
                      {value?.sig ? encodeHex(value.sig) : '-'}
                    </Code>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        <CheckboxGroup>
          <Stack spacing={4} w="full">
            {/*assets*/}
            {assetValues.length > 0 ? (
              assetValues.map((value, index) => (
                <HStack
                  key={`atomic-transaction-action-asset-item-${index}`}
                  spacing={2}
                  w="full"
                >
                  {/*asset id/name*/}
                  <HStack>
                    <Checkbox
                      isChecked={value.isChecked}
                      onChange={handleAssetCheckChange(value.id)}
                      size="lg"
                      value={value.id}
                    />
                    <Tooltip label={value.name || value.id}>
                      <Text noOfLines={1} size="md" w={200}>
                        {value.name || value.id}
                      </Text>
                    </Tooltip>
                  </HStack>

                  {/*balance*/}
                  <Tooltip
                    label={`${convertToStandardUnit(
                      value.balance,
                      value.decimals
                    ).toString()}${value.symbol ? ` ${value.symbol}` : ''}`}
                  >
                    <HStack flexGrow={1}>
                      <Text size="sm">
                        {formatCurrencyUnit(
                          convertToStandardUnit(value.balance, value.decimals)
                        )}
                      </Text>
                      {value.symbol && <Text size="sm">{value.symbol}</Text>}
                    </HStack>
                  </Tooltip>

                  {/*amount*/}
                  <NumberInput
                    flexGrow={1}
                    isDisabled={!value.isChecked}
                    min={0}
                    max={
                      value
                        ? parseFloat(
                            convertToStandardUnit(
                              value.balance,
                              value.decimals
                            ).toString()
                          )
                        : 0
                    }
                    maxW={200}
                    precision={value.decimals}
                    onChange={handleAmountChange(value.id)}
                    value={value.amount.toString()}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </HStack>
              ))
            ) : (
              <VStack
                alignItems="center"
                justifyContent="center"
                minH={150}
                w="full"
              >
                <Text size="sm" textAlign="center">
                  No assets found!
                </Text>
              </VStack>
            )}

            <Divider />

            {/*application calls*/}
            <HStack>
              <Checkbox
                isChecked={includeApplicationCall}
                isDisabled={!account}
                onChange={handleIncludeApplicationCallCheckChange}
                size="lg"
              />
              <Text size="md">Include application call?</Text>
            </HStack>
          </Stack>
        </CheckboxGroup>

        {/*send atomic transactions button*/}
        <VStack justifyContent="center" spacing={3} w="full">
          <Button
            borderRadius={theme.radii['3xl']}
            colorScheme="primaryLight"
            minW={250}
            onClick={handleSignAtomicTransactionsClick}
            size="lg"
          >
            Send Atomic Transactions
          </Button>
        </VStack>
      </VStack>
    );
  };

  useEffect(() => {
    if (account && network) {
      setAssetValues([
        // just add algorand as an asset for simplicity
        {
          amount: new BigNumber('0'),
          balance: account.balance,
          decimals: network.nativeCurrency.decimals,
          id: '0',
          isChecked: false,
          name: network.canonicalName,
          symbol: network.nativeCurrency.symbol,
        },
        ...account.assets.map((value) => ({
          ...value,
          amount: new BigNumber('0'),
          isChecked: false,
        })),
      ]);
      setIncludeApplicationCall(true);
    }
  }, [account, network]);

  return <TabPanel w="full">{renderContent()}</TabPanel>;
};

export default AtomicTransactionActionsTab;
