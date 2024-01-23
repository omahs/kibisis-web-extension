import {
  AlgorandProvider,
  BaseError,
  IBaseResult,
  IEnableResult,
} from '@agoralabs-sh/algorand-provider';
import {
  CreateToastFnReturn,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Tag,
  TagLabel,
  Text,
  useToast,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import React, { FC, useEffect, useState } from 'react';
import { Provider, PROVIDER_ID, useWallet } from '@txnlab/use-wallet';
import { SessionTypes } from '@walletconnect/types';

// components
import WalletConnectIcon from '@extension/components/WalletConnectIcon';

// config
import { networks } from '@extension/config';

// constants
import {
  ALGORAND_TEST_NET_GENESIS_HASH,
  VOI_TEST_NET_GENESIS_HASH,
} from '../../constants';

// enums
import { ConnectionTypeEnum } from '../../enums';

// hooks
import useWalletConnect from '../../hooks/useWalletConnect';

// types
import { ILogger } from '@common/types';
import { INetwork } from '@extension/types';
import { IWindow } from '@external/types';
import { IAccountInformation } from '../../types';

// utils
import createLogger from '@common/utils/createLogger';
import { getAccountInformation } from '../../utils';

export interface IConnectResult {
  accounts: IAccountInformation[];
  connectionType: ConnectionTypeEnum | null;
  network: INetwork;
}

interface IProps {
  onConnect: (result: IConnectResult) => void;
  onReset: () => void;
}

const ConnectMenu: FC<IProps> = ({ onConnect, onReset }: IProps) => {
  const toast: CreateToastFnReturn = useToast({
    duration: 3000,
    isClosable: true,
    position: 'top',
  });
  const { connect } = useWalletConnect();
  const { connectedAccounts, providers } = useWallet();
  // state
  const [useWalletNetwork, setUseWalletNetwork] = useState<INetwork | null>(
    null
  );
  // misc
  const logger: ILogger = createLogger('debug');
  // handlers
  const handleConnectViaAlgorandProvider =
    (genesisHash: string) => async () => {
      const algorand: AlgorandProvider | undefined = (window as IWindow)
        .algorand;
      let accounts: IAccountInformation[];
      let network: INetwork | null;

      if (!algorand) {
        toast({
          description:
            'Algorand Provider has been intialized; there is no supported wallet',
          status: 'error',
          title: 'window.algorand not found!',
        });

        return;
      }

      try {
        const result: IBaseResult & IEnableResult = await algorand.enable({
          genesisHash,
        });

        network =
          networks.find((value) => value.genesisHash === result.genesisHash) ||
          null;

        if (!network) {
          throw new Error(`unknown network "${result.genesisId}"`);
        }

        accounts = await Promise.all(
          result.accounts.map<Promise<IAccountInformation>>((account) =>
            getAccountInformation(account, network as INetwork)
          )
        );

        onConnect({
          accounts,
          connectionType: ConnectionTypeEnum.AlgorandProvider,
          network,
        });

        toast({
          description: `Successfully connected to "${result.id}".`,
          status: 'success',
          title: 'Connected!',
        });
      } catch (error) {
        toast({
          description: (error as BaseError).message,
          status: 'error',
          title: `${(error as BaseError).code}: ${(error as BaseError).name}`,
        });
      }
    };
  const handleConnectViaUseWallet = (genesisHash: string) => async () => {
    const provider: Provider | null =
      providers?.find((value) => value.metadata.id === PROVIDER_ID.CUSTOM) ||
      null;
    let network: INetwork | null;

    if (!provider) {
      toast({
        status: 'error',
        title: `Use Wallet Provider Not Initialized`,
      });

      return;
    }

    network =
      networks.find((value) => value.genesisHash === genesisHash) || null;

    if (!network) {
      toast({
        description: genesisHash,
        status: 'error',
        title: `Unknown Network`,
      });

      return;
    }

    // set the genesis hash
    (
      provider as Provider & {
        providerProxy: {
          setGenesisHash: (genesisHash: string) => void;
        };
      }
    ).providerProxy.setGenesisHash(network.genesisHash);

    if (provider.isConnected) {
      setUseWalletNetwork(null);

      await provider.disconnect();
    }

    setUseWalletNetwork(network);

    await provider.connect();
  };
  const handleWalletConnect = async () => {
    const _functionName: string = 'handleWalletConnect';
    let accounts: IAccountInformation[];
    let addresses: string[];
    let namespace: SessionTypes.BaseNamespace | null;
    let namespaceKey: string | null;
    let network: INetwork | null;
    let session: SessionTypes.Struct;

    try {
      session = await connect();
      namespaceKey = Object.keys(session.namespaces)[0] || null;

      if (!namespaceKey) {
        logger.error(
          `${_functionName}: failed to get namespace for session`,
          session
        );

        throw new Error('failed to get namespace');
      }

      namespace = session.namespaces[namespaceKey] || null;

      if (!namespace) {
        logger.error(
          `${_functionName}: failed to get namespace for session`,
          session
        );

        throw new Error('failed to get namespace');
      }

      network =
        namespace.chains
          ?.map((chainId) =>
            networks.find(
              (value) =>
                `${value.namespace.key}:${value.namespace.reference}` ===
                chainId
            )
          )
          .pop() || null;

      if (!network) {
        logger.error(
          `${_functionName}: failed to get namespace for session`,
          session
        );

        throw new Error('failed to get network for ');
      }

      addresses = namespace.accounts.reduce((acc, value) => {
        const address: string | null = value.split(':').pop() || null;

        return [...acc, ...(address ? [address] : [])];
      }, []);
      accounts = await Promise.all(
        addresses.map(
          async (value) =>
            await getAccountInformation(
              {
                address: value,
              },
              // @ts-ignore
              network
            )
        )
      );

      onConnect({
        accounts,
        connectionType: ConnectionTypeEnum.WalletConnectv2,
        network,
      });
    } catch (error) {
      toast({
        status: 'error',
        title: error.message,
      });
    }
  };
  const handleReset = async () => {
    setUseWalletNetwork(null);
    onReset();
  };
  // renders
  const renderNetworkTag = () => (
    <Tag colorScheme="yellow" size="sm" variant="subtle">
      <TagLabel>TestNet</TagLabel>
    </Tag>
  );

  useEffect(() => {
    if (useWalletNetwork) {
      (async () => {
        onConnect({
          accounts: await Promise.all(
            connectedAccounts.map<Promise<IAccountInformation>>(
              ({ address, name }) =>
                getAccountInformation({ address, name }, useWalletNetwork)
            )
          ),
          connectionType: ConnectionTypeEnum.UseWallet,
          network: useWalletNetwork,
        });
      })();
    }
  }, [connectedAccounts]);

  return (
    <Menu>
      <MenuButton
        px={4}
        py={2}
        transition="all 0.2s"
        borderRadius="md"
        borderWidth="1px"
        _hover={{ bg: 'gray.400' }}
        _expanded={{ bg: 'primary.400' }}
        _focus={{ boxShadow: 'outline' }}
      >
        Connect <ChevronDownIcon />
      </MenuButton>
      <MenuList>
        <MenuGroup title="@agoralabs-sh/algorand-provider">
          <MenuItem
            onClick={handleConnectViaAlgorandProvider(
              ALGORAND_TEST_NET_GENESIS_HASH
            )}
          >
            <HStack alignItems="center" w="full">
              <Text size="sm">Connect to Algorand</Text>

              {renderNetworkTag()}
            </HStack>
          </MenuItem>

          <MenuItem
            onClick={handleConnectViaAlgorandProvider(
              VOI_TEST_NET_GENESIS_HASH
            )}
          >
            <HStack alignItems="center" w="full">
              <Text size="sm">Connect to Voi</Text>

              {renderNetworkTag()}
            </HStack>
          </MenuItem>
        </MenuGroup>

        <MenuDivider />

        <MenuGroup title="@txnlab/use-wallet">
          <MenuItem
            onClick={handleConnectViaUseWallet(ALGORAND_TEST_NET_GENESIS_HASH)}
          >
            <HStack alignItems="center" w="full">
              <Text size="sm">Connect to Algorand</Text>

              {renderNetworkTag()}
            </HStack>
          </MenuItem>

          <MenuItem
            onClick={handleConnectViaUseWallet(VOI_TEST_NET_GENESIS_HASH)}
          >
            <HStack alignItems="center" w="full">
              <Text size="sm">Connect to Voi</Text>

              {renderNetworkTag()}
            </HStack>
          </MenuItem>
        </MenuGroup>

        <MenuDivider />

        <MenuItem onClick={handleWalletConnect}>
          <HStack justifyContent="space-between" w="full">
            <Text size="sm">Connect via WalletConnect v2</Text>

            <WalletConnectIcon />
          </HStack>
        </MenuItem>

        <MenuDivider />

        <MenuItem onClick={handleReset}>
          <Text size="sm" w="full">
            Reset Connection
          </Text>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ConnectMenu;
