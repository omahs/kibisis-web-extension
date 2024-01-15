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
import { IUseWalletConnectState } from './types';

// utils
import extractFaviconUrl from '@external/utils/extractFaviconUrl';

export default function useWalletConnect(): IUseWalletConnectState {
  // states
  const [signClient, setSignClient] = useState<SignClient | null>(null);
  const [walletConnectModal, setWalletConnectModal] =
    useState<WalletConnectModal | null>(null);
  // misc
  const optionalNamespaces: ProposalTypes.OptionalNamespaces = {
    // testnets
    algorand: {
      chains: ['algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDe'],
      events: [],
      methods: [
        WalletConnectMethodEnum.SignTxns,
        WalletConnectMethodEnum.SignBytes,
      ],
    },
    voi: {
      chains: ['voi:IXnoWtviVVJW5LGivNFc0Dq14V3kqaXu'],
      events: [],
      methods: [
        WalletConnectMethodEnum.SignTxns,
        WalletConnectMethodEnum.SignBytes,
      ],
    },
  };
  // actions
  const connect = async () => {
    let pairing: PairingTypes.Struct | null;
    let session: SessionTypes.Struct;

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
        optionalNamespaces,
        pairingTopic: pairing.topic,
      });

      return await approval();
    }

    const { approval, uri } = await signClient.connect({
      optionalNamespaces,
    });

    if (!uri) {
      throw new Error('failed to get walletconnect uri');
    }

    await walletConnectModal.openModal({ uri });

    session = await approval();

    walletConnectModal.closeModal();

    return session;
  };

  useEffect(() => {
    let _signClient: SignClient;

    setWalletConnectModal(
      new WalletConnectModal({
        projectId: __WALLET_CONNECT_PROJECT_ID__,
        explorerRecommendedWalletIds: 'NONE',
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
  };
}
