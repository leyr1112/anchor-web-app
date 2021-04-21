import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { WalletController, WalletControllerOptions } from '../controller';
import { ConnectType, NetworkInfo, WalletInfo, WalletStatus } from '../types';
import { Wallet, WalletContext } from './useWallet';

export interface WalletProviderProps extends WalletControllerOptions {
  children: ReactNode;
}

export function WalletProvider({
  children,
  defaultNetwork,
  walletConnectChainIds,
  connectorOpts,
  pushServerOpts,
  createReadonlyWalletSession,
}: WalletProviderProps) {
  const [controller] = useState<WalletController>(
    () =>
      new WalletController({
        defaultNetwork,
        walletConnectChainIds,
        connectorOpts,
        pushServerOpts,
        createReadonlyWalletSession,
      }),
  );

  const [availableConnectTypes, setAvailableConnectTypes] = useState<
    ConnectType[]
  >(() => []);
  const [status, setStatus] = useState<WalletStatus>(WalletStatus.INITIALIZING);
  const [network, setNetwork] = useState<NetworkInfo>(defaultNetwork);
  const [wallets, setWallets] = useState<WalletInfo[]>(() => []);

  useEffect(() => {
    const availableConnectTypesSubscription = controller
      .availableConnectTypes()
      .subscribe({
        next: (value) => {
          setAvailableConnectTypes(value);
        },
      });

    const statusSubscription = controller.status().subscribe({
      next: (value) => {
        setStatus(value);
      },
    });

    const networkSubscription = controller.network().subscribe({
      next: (value) => {
        setNetwork(value);
      },
    });

    const walletsSubscription = controller.wallets().subscribe({
      next: (value) => {
        setWallets(value);
      },
    });

    return () => {
      availableConnectTypesSubscription.unsubscribe();
      statusSubscription.unsubscribe();
      networkSubscription.unsubscribe();
      walletsSubscription.unsubscribe();
    };
  }, [controller]);

  const state = useMemo<Wallet>(() => {
    return {
      availableConnectTypes,
      status,
      network,
      wallets,
      connect: controller.connect,
      disconnect: controller.disconnect,
      post: controller.post,
      recheckStatus: controller.recheckStatus,
    };
  }, [
    availableConnectTypes,
    controller.connect,
    controller.disconnect,
    controller.post,
    controller.recheckStatus,
    network,
    status,
    wallets,
  ]);

  return (
    <WalletContext.Provider value={state}>{children}</WalletContext.Provider>
  );
}
