import { WalletConnectModal } from '@walletconnect/modal';
import SignClient from '@walletconnect/sign-client';
import {
  PairingTypes,
  ProposalTypes,
  SessionTypes,
} from '@walletconnect/types';
import { useEffect, useState } from 'react';

// enums
import { WalletConnectMethodEnum } from '@extension/enums';

// types
import { IArc0001SignTxns } from '@common/types';
import { INetwork } from '@extension/types';
import { IUseWalletConnectState } from './types';

// utils
import extractFaviconUrl from '@external/utils/extractFaviconUrl';

export default function useWalletConnect(): IUseWalletConnectState {
  // states
  const [signClient, setSignClient] = useState<SignClient | null>(null);
  const [session, setSession] = useState<SessionTypes.Struct | null>(null);
  const [walletConnectModal, setWalletConnectModal] =
    useState<WalletConnectModal | null>(null);
  // actions
  const connect = async () => {
    let pairing: PairingTypes.Struct | null;
    let _session: SessionTypes.Struct;

    if (!signClient || !walletConnectModal) {
      throw new Error('walletconnect not initialized');
    }

    // attempt to get existing session
    pairing =
      signClient.core.pairing.getPairings().find((value) => value.active) ||
      null;

    // if we have an existing active pairing, we can use that
    if (pairing) {
      const { approval } = await signClient.connect({
        pairingTopic: pairing.topic,
      });

      _session = await approval();

      setSession(_session);

      return _session;
    }

    const { approval, uri } = await signClient.connect({});

    if (!uri) {
      throw new Error('failed to get walletconnect uri');
    }

    await walletConnectModal.openModal({ uri });

    try {
      _session = await approval();

      walletConnectModal.closeModal();
      setSession(_session);

      return _session;
    } catch (error) {
      walletConnectModal.closeModal();

      throw error;
    }
  };
  const signTransactions = async (
    txns: IArc0001SignTxns[],
    network: INetwork
  ) => {
    if (signClient && session) {
      await signClient.request({
        topic: session.topic,
        chainId: `${network.namespace.key}:${network.namespace.reference}`,
        request: {
          method: WalletConnectMethodEnum.SignTxns,
          params: txns,
        },
      });
    }
  };

  useEffect(() => {
    setWalletConnectModal(
      new WalletConnectModal({
        projectId: __WALLET_CONNECT_PROJECT_ID__,
        explorerRecommendedWalletIds: 'NONE',
        walletConnectVersion: 2,
      })
    );

    (async () => {
      setSignClient(
        await SignClient.init({
          metadata: {
            description:
              document
                .querySelector('meta[name="description"]')
                ?.getAttribute('content') || '',
            icons: [extractFaviconUrl() || ''],
            name:
              document
                .querySelector('meta[name="application-name"]')
                ?.getAttribute('content') || document.title,
            url: `${window.location.protocol}//${window.location.host}`,
          },
          projectId: __WALLET_CONNECT_PROJECT_ID__,
        })
      );
    })();
  }, []);

  return {
    connect,
    signTransactions,
  };
}
