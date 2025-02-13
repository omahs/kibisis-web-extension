import { BaseError } from '@agoralabs-sh/algorand-provider';
import {
  Button,
  Code,
  CreateToastFnReturn,
  Grid,
  GridItem,
  HStack,
  Input,
  Spacer,
  TabPanel,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useWallet } from '@txnlab/use-wallet';
import { decode as decodeBase64 } from '@stablelib/base64';
import { encode as encodeHex } from '@stablelib/hex';
import {
  decodeSignedTransaction,
  encodeUnsignedTransaction,
  SignedTransaction,
  Transaction,
} from 'algosdk';
import React, { ChangeEvent, FC, useState } from 'react';

// components
import ConnectionNotInitializedContent from '../ConnectionNotInitializedContent';

// enums
import { TransactionTypeEnum } from '@extension/enums';
import { ConnectionTypeEnum } from '../../enums';

// theme
import { theme } from '@extension/theme';

// types
import { INetwork } from '@extension/types';
import { IAccountInformation } from '../../types';

// utils
import convertToStandardUnit from '@common/utils/convertToStandardUnit';
import {
  algorandProviderSignTxns,
  createAppCallTransaction,
  useWalletSignTxns,
} from '../../utils';

interface IProps {
  account: IAccountInformation | null;
  connectionType: ConnectionTypeEnum | null;
  network: INetwork | null;
}

const ApplicationActionsTab: FC<IProps> = ({
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
  const [signedTransaction, setSignedTransaction] =
    useState<SignedTransaction | null>(null);
  const [note, setNote] = useState<string>('');
  // handlers
  const handleNoteChange = (event: ChangeEvent<HTMLInputElement>) =>
    setNote(event.target.value);
  const handleSignTransactionClick =
    (type: TransactionTypeEnum) => async () => {
      let result: (string | null)[] | null = null;
      let unsignedTransaction: Transaction | null = null;

      if (!account || !connectionType || !network) {
        toast({
          description: 'You must first enable the dApp with the wallet.',
          status: 'error',
          title: 'No Account Not Found!',
        });

        return;
      }

      try {
        unsignedTransaction = await createAppCallTransaction({
          from: account.address,
          network,
          note: note.length > 0 ? note : null,
          type,
        });

        if (!unsignedTransaction) {
          toast({
            status: 'error',
            title: 'Unknown Transaction Type',
          });

          return;
        }

        switch (connectionType) {
          case ConnectionTypeEnum.AlgorandProvider:
            result = await algorandProviderSignTxns([unsignedTransaction]);

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
              [0],
              [encodeUnsignedTransaction(unsignedTransaction)]
            );

            break;
          default:
            break;
        }

        if (result && result[0]) {
          toast({
            description: `Successfully signed payment transaction for provider "${connectionType}".`,
            status: 'success',
            title: 'Payment Transaction Signed!',
          });

          setSignedTransaction(
            decodeSignedTransaction(decodeBase64(result[0]))
          );
        }
      } catch (error) {
        toast({
          description: (error as BaseError).message,
          status: 'error',
          title: `${(error as BaseError).code}: ${(error as BaseError).name}`,
        });
      }
    };
  // renders
  const renderContent = () => {
    if (!connectionType) {
      return <ConnectionNotInitializedContent />;
    }

    return (
      <VStack justifyContent="center" spacing={8} w="full">
        {/*balance*/}
        <HStack spacing={2} w="full">
          <Text size="md" textAlign="left">
            Balance:
          </Text>
          <Spacer />
          <Text size="md" textAlign="left">
            {account && network
              ? `${convertToStandardUnit(
                  account.balance,
                  network.nativeCurrency.decimals
                )} ${network.nativeCurrency.symbol}`
              : 'N/A'}
          </Text>
        </HStack>

        {/*note*/}
        <HStack w="full">
          <Text size="md" textAlign="left">
            Note:
          </Text>
          <Input onChange={handleNoteChange} value={note} />
        </HStack>

        {/*signed transaction data*/}
        <VStack spacing={3} w="full">
          <HStack spacing={2} w="full">
            <Text>Signed transaction:</Text>
            <Code fontSize="sm" wordBreak="break-word">
              {signedTransaction?.txn.toString() || '-'}
            </Code>
          </HStack>
          <HStack spacing={2} w="full">
            <Text>Signed transaction signature (hex):</Text>
            <Code fontSize="sm" wordBreak="break-word">
              {signedTransaction?.sig
                ? encodeHex(signedTransaction.sig).toUpperCase()
                : '-'}
            </Code>
          </HStack>
        </VStack>

        {/*sign transaction button*/}
        <Grid gap={2} templateColumns="repeat(2, 1fr)" w="full">
          {[
            {
              type: TransactionTypeEnum.ApplicationCreate,
              label: 'Send Create App Transaction',
            },
            {
              type: TransactionTypeEnum.ApplicationOptIn,
              label: 'Send App Opt-In Transaction',
            },
            {
              type: TransactionTypeEnum.ApplicationNoOp,
              label: 'Send App NoOp Transaction',
            },
            {
              type: TransactionTypeEnum.ApplicationClearState,
              label: 'Send App Clear State Transaction',
            },
            {
              type: TransactionTypeEnum.ApplicationCloseOut,
              label: 'Send App Close Out Transaction',
            },
            {
              type: TransactionTypeEnum.ApplicationDelete,
              label: 'Send Delete App Transaction',
            },
            {
              type: TransactionTypeEnum.ApplicationUpdate,
              label: 'Send Update App Transaction',
            },
          ].map(({ label, type }, index) => (
            <GridItem
              key={`application-action-sign-transaction-button-item-${index}`}
            >
              <Button
                borderRadius={theme.radii['3xl']}
                colorScheme="primaryLight"
                onClick={handleSignTransactionClick(type)}
                size="lg"
                w={365}
              >
                {label}
              </Button>
            </GridItem>
          ))}
        </Grid>
      </VStack>
    );
  };

  return <TabPanel w="full">{renderContent()}</TabPanel>;
};

export default ApplicationActionsTab;
