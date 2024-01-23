import { SessionTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils';
import { Web3WalletTypes } from '@walletconnect/web3wallet';
import { IWeb3Wallet } from '@walletconnect/web3wallet/dist/types';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

// features
import { setSessionThunk } from '@extension/features/sessions';

// selectors
import {
  useSelectLogger,
  useSelectNetworks,
  useSelectSessions,
  useSelectWeb3Wallet,
} from '@extension/selectors';

// types
import { ILogger } from '@common/types';
import { IAppThunkDispatch, INetwork, ISession } from '@extension/types';
import { IUseWalletConnectState } from './types';

// utils
import mapSessionFromWalletConnectSession from '@extension/utils/mapSessionFromWalletConnectSession';
import { createSessionNamespaces } from './utils';

export default function useWalletConnect(
  uri: string | null
): IUseWalletConnectState {
  const _functionName: string = 'useWalletConnect';
  const sessionsRef: MutableRefObject<ISession[]> = useRef<ISession[]>([]);
  const web3WalletRef: MutableRefObject<IWeb3Wallet | null> =
    useRef<IWeb3Wallet | null>(null);
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const logger: ILogger = useSelectLogger();
  const networks: INetwork[] = useSelectNetworks();
  const sessions: ISession[] = useSelectSessions();
  const web3Wallet: IWeb3Wallet | null = useSelectWeb3Wallet();
  // states
  const [pairing, setPairing] = useState<boolean>(false);
  const [sessionProposal, setSessionProposal] =
    useState<Web3WalletTypes.SessionProposal | null>(null);
  const approveSessionProposalAction: (
    authorizedAddresses: string[],
    network: INetwork
  ) => Promise<void> = async (
    authorizedAddresses: string[],
    network: INetwork
  ) => {
    let session: SessionTypes.Struct;

    if (web3Wallet && sessionProposal) {
      logger.debug(
        `${_functionName}(): approving session proposal "${sessionProposal.id}"`
      );

      session = await web3Wallet.approveSession({
        id: sessionProposal.id,
        namespaces: createSessionNamespaces({
          authorizedAddresses,
          network,
          proposalParams: sessionProposal.params,
        }),
      });

      // add the session to the store
      dispatch(
        setSessionThunk(
          mapSessionFromWalletConnectSession({
            authorizedAddresses,
            network,
            walletConnectSession: session,
          })
        )
      );

      // clean up
      setPairing(false);
      setSessionProposal(null);
    }
  };
  const handleSessionProposal: (
    proposal: Web3WalletTypes.SessionProposal
  ) => Promise<void> = async (proposal: Web3WalletTypes.SessionProposal) => {
    let existingSession: ISession | null;
    let existingSessionNetwork: INetwork | null;

    logger.debug(
      `${_functionName}(): received session proposal "${proposal.id}"`
    );

    // if there is a pairing topic, check if the session exists
    if (proposal.params.pairingTopic) {
      existingSession =
        sessionsRef.current.find(
          (value) =>
            value.walletConnectMetadata?.pairingTopic ===
            proposal.params.pairingTopic
        ) || null;
      existingSessionNetwork =
        networks.find(
          (value) => value.genesisHash === existingSession?.genesisHash
        ) || null;

      if (web3WalletRef.current && existingSession && existingSessionNetwork) {
        logger.debug(
          `${_functionName}(): existing session found for pairing "${existingSession.walletConnectMetadata?.pairingTopic}"`
        );

        await web3WalletRef.current.approveSession({
          id: proposal.id,
          namespaces: createSessionNamespaces({
            authorizedAddresses: existingSession.authorizedAddresses,
            network: existingSessionNetwork,
            proposalParams: proposal.params,
          }),
        });
      }
    }

    setSessionProposal(proposal);
    setPairing(false);
  };
  const handleSessionRequest = () => {};
  const rejectSessionProposalAction: () => Promise<void> = async () => {
    if (web3Wallet && sessionProposal) {
      logger.debug(
        `${_functionName}(): rejecting session proposal "${sessionProposal.id}"`
      );

      await web3Wallet.rejectSession({
        id: sessionProposal.id,
        reason: getSdkError('USER_REJECTED'),
      });

      // clean up
      setPairing(false);
      setSessionProposal(null);
    }
  };

  useEffect(() => {
    if (web3Wallet && uri) {
      (async () => {
        web3Wallet.on('session_proposal', handleSessionProposal);
        web3Wallet.on('session_request', handleSessionRequest);

        setPairing(true);

        await web3Wallet.core.pairing.pair({
          uri,
        });
      })();
    }

    return function cleanup() {
      if (web3Wallet) {
        web3Wallet.removeListener('session_proposal', handleSessionProposal);
      }
    };
  }, [uri]);
  useEffect(() => {
    sessionsRef.current = sessions;
  }, [sessions]);
  useEffect(() => {
    web3WalletRef.current = web3Wallet;
  }, [web3Wallet]);

  return {
    approveSessionProposalAction,
    pairing,
    rejectSessionProposalAction,
    sessionProposal,
  };
}
