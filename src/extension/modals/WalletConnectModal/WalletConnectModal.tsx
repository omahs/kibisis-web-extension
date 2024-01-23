import {
  Avatar,
  Checkbox,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { ChangeEvent, FC, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Rings } from 'react-loader-spinner';

// components
import Button from '@extension/components/Button';
import EmptyState from '@extension/components/EmptyState';
import NetworkSelect from '@extension/components/NetworkSelect';
import SessionRequestHeader from '@extension/components/SessionRequestHeader';
import WalletConnectBannerIcon from '@extension/components/WalletConnectBannerIcon';
import WalletConnectModalBodySkeleton from './WalletConnectModalBodySkeleton';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useCaptureQrCode from '@extension/hooks/useCaptureQrCode';
import useColorModeValue from '@extension/hooks/useColorModeValue';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useWalletConnect from '@extension/hooks/useWalletConnect';

// selectors
import {
  useSelectAccounts,
  useSelectFetchingAccounts,
  useSelectInitializingWalletConnect,
  useSelectSelectedNetwork,
  useSelectNetworks,
  useSelectWalletConnectModalOpen,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// theme
import { theme } from '@extension/theme';

// types
import { IAccount, INetwork } from '@extension/types';

// utils
import ellipseAddress from '@extension/utils/ellipseAddress';

interface IProps {
  onClose: () => void;
}

const WalletConnectModal: FC<IProps> = ({ onClose }: IProps) => {
  const { t } = useTranslation();
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const fetching: boolean = useSelectFetchingAccounts();
  const initializing: boolean = useSelectInitializingWalletConnect();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  const networks: INetwork[] = useSelectNetworks();
  const isOpen: boolean = useSelectWalletConnectModalOpen();
  // hooks
  const { scanning, startScanningAction, stopScanningAction, url } =
    useCaptureQrCode();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColor: string = useColorModeValue(
    theme.colors.primaryLight['500'],
    theme.colors.primaryDark['500']
  );
  const primaryColorScheme: string = usePrimaryColorScheme();
  const subTextColor: string = useSubTextColor();
  const {
    approveSessionProposalAction,
    pairing,
    rejectSessionProposalAction,
    sessionProposal,
  } = useWalletConnect(url);
  // states
  const [authorizedAddresses, setAuthorizedAddresses] = useState<string[]>([]);
  const [network, setNetwork] = useState<INetwork>(
    selectedNetwork || networks[0]
  );
  // handlers
  const handleApproveClick = async () => {
    if (authorizedAddresses.length > 0 && network) {
      await approveSessionProposalAction(authorizedAddresses, network);
    }

    handleClose();
  };
  const handleCancelClick = () => handleClose();
  const handleClose = () => {
    stopScanningAction();
    setAuthorizedAddresses([]);
    onClose();
  };
  const handleOnAccountCheckChange =
    (address: string) => (event: ChangeEvent<HTMLInputElement>) => {
      // add if checked and doesn't exist
      if (event.target.checked) {
        if (!authorizedAddresses.find((value) => value === address)) {
          setAuthorizedAddresses([...authorizedAddresses, address]);
        }

        return;
      }

      // remove if unchecked
      setAuthorizedAddresses(
        authorizedAddresses.filter((value) => value !== address)
      );
    };
  const handleNetworkSelect = (value: INetwork) => setNetwork(value);
  const handleRejectClick = async () => {
    await rejectSessionProposalAction();

    handleClose();
  };
  // renders
  const renderBody = () => {
    let accountNodes: ReactNode[];

    if (initializing || scanning) {
      return (
        <VStack
          alignItems="center"
          flexGrow={1}
          justifyContent="center"
          spacing={4}
          w="full"
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor={defaultTextColor}
            color={primaryColor}
            size="xl"
          />

          <Text color={defaultTextColor} fontSize="md" textAlign="center">
            {t<string>(
              scanning
                ? 'captions.scanningForQrCode'
                : 'captions.initializingWalletConnect'
            )}
          </Text>
        </VStack>
      );
    }

    if (pairing) {
      return (
        <VStack
          alignItems="center"
          flexGrow={1}
          justifyContent="center"
          spacing={4}
          w="full"
        >
          <Rings
            ariaLabel="rings-loading"
            color={primaryColor}
            height={200}
            radius="6"
          />

          <Text color={defaultTextColor} fontSize="md" textAlign="center">
            {t<string>('captions.connectingToWalletConnect')}
          </Text>
        </VStack>
      );
    }

    if (!network || fetching) {
      return <WalletConnectModalBodySkeleton />;
    }

    accountNodes = accounts.reduce<ReactNode[]>(
      (acc, account, currentIndex) => {
        const address: string =
          AccountService.convertPublicKeyToAlgorandAddress(account.publicKey);

        return [
          ...acc,
          <HStack
            key={`wallet-connect-modal-item-${currentIndex}`}
            py={4}
            spacing={4}
            w="full"
          >
            <Avatar name={account.name || address} />
            {account.name ? (
              <VStack
                alignItems="flex-start"
                flexGrow={1}
                justifyContent="space-evenly"
                spacing={0}
              >
                <Text color={defaultTextColor} fontSize="md" textAlign="left">
                  {account.name}
                </Text>
                <Text color={subTextColor} fontSize="sm" textAlign="left">
                  {ellipseAddress(address, {
                    end: 10,
                    start: 10,
                  })}
                </Text>
              </VStack>
            ) : (
              <Text
                color={defaultTextColor}
                flexGrow={1}
                fontSize="md"
                textAlign="left"
              >
                {ellipseAddress(address, {
                  end: 10,
                  start: 10,
                })}
              </Text>
            )}
            <Checkbox
              colorScheme={primaryColorScheme}
              isChecked={
                !!authorizedAddresses.find((value) => value === address)
              }
              onChange={handleOnAccountCheckChange(address)}
            />
          </HStack>,
        ];
      },
      []
    );

    return (
      <VStack w="full">
        {accountNodes.length > 0 ? (
          accountNodes
        ) : (
          <>
            {/*empty state*/}
            <Spacer />
            <EmptyState text={t<string>('headings.noAccountsFound')} />
            <Spacer />
          </>
        )}
      </VStack>
    );
  };
  const renderFooter = () => {
    if (!network || fetching || pairing || initializing || scanning) {
      return (
        <Button
          onClick={handleCancelClick}
          size="lg"
          variant="outline"
          w="full"
        >
          {t<string>('buttons.cancel')}
        </Button>
      );
    }

    return (
      <HStack spacing={4} w="full">
        <Button
          onClick={handleRejectClick}
          size="lg"
          variant="outline"
          w="full"
        >
          {t<string>('buttons.reject')}
        </Button>

        <Button onClick={handleApproveClick} size="lg" variant="solid" w="full">
          {t<string>('buttons.approve')}
        </Button>
      </HStack>
    );
  };

  useEffect(() => {
    if (isOpen) {
      startScanningAction();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      motionPreset="slideInBottom"
      onClose={onClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalContent
        backgroundColor="var(--chakra-colors-chakra-body-bg)"
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
      >
        <ModalHeader display="flex" justifyContent="center" px={DEFAULT_GAP}>
          {sessionProposal ? (
            <VStack alignItems="center" justifyContent="flex-start" spacing={2}>
              <SessionRequestHeader
                description={
                  sessionProposal.params.proposer.metadata.description
                }
                host={sessionProposal.params.proposer.metadata.url}
                iconUrl={sessionProposal.params.proposer.metadata.icons[0]}
                isWalletConnect={true}
                name={sessionProposal.params.proposer.metadata.name}
                network={network || undefined}
              />

              {/*network*/}
              <NetworkSelect
                network={network}
                networks={networks}
                onSelect={handleNetworkSelect}
              />

              {/*caption*/}
              <Text
                color={subTextColor}
                fontSize="sm"
                textAlign="center"
                w="full"
              >
                {t<string>('captions.enableRequest')}
              </Text>
            </VStack>
          ) : (
            <WalletConnectBannerIcon h={9} w={60} />
          )}
        </ModalHeader>

        <ModalBody display="flex" px={DEFAULT_GAP}>
          {renderBody()}
        </ModalBody>

        <ModalFooter p={DEFAULT_GAP}>{renderFooter()}</ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WalletConnectModal;
