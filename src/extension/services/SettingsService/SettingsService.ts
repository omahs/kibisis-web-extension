// config
import { networks } from '@extension/config';

// constants
import {
  PASSWORD_LOCK_DURATION_NORMAL,
  SETTINGS_ADVANCED_KEY,
  SETTINGS_APPEARANCE_KEY,
  SETTINGS_GENERAL_KEY,
  SETTINGS_SECURITY_KEY,
} from '@extension/constants';

// services
import StorageManager from '../StorageManager';

// types
import type { ILogger } from '@common/types';
import type {
  IAdvancedSettings,
  IAppearanceSettings,
  IGeneralSettings,
  INetwork,
  ISecuritySettings,
  ISettings,
} from '@extension/types';
import type { ICreateOptions } from './types';

// utils
import selectDefaultNetwork from '@extension/utils/selectDefaultNetwork';

export default class SettingsService {
  // private variables
  private readonly logger: ILogger | null;
  private readonly storageManager: StorageManager;

  constructor({ logger, storageManager }: ICreateOptions) {
    this.logger = logger || null;
    this.storageManager = storageManager || new StorageManager();
  }

  /**
   * public static functions
   */

  public static initializeDefaultSettings(): ISettings {
    const defaultNetwork: INetwork = selectDefaultNetwork(networks);

    return {
      advanced: {
        allowBetaNet: false,
        allowDidTokenFormat: false,
        allowMainNet: false,
        debugLogging: false,
      },
      appearance: {
        theme: 'light',
      },
      general: {
        preferredBlockExplorerIds: {},
        selectedNetworkGenesisHash: defaultNetwork.genesisHash,
      },
      security: {
        passwordLockTimeoutDuration: PASSWORD_LOCK_DURATION_NORMAL,
        enablePasswordLock: false,
      },
    };
  }

  /**
   * public functions
   */

  /**
   * Gets all the settings from storage.
   * @returns {Promise<IStandardAsset[]>} the list of standard assets.
   */
  public async getAll(): Promise<ISettings> {
    const storageItems: Record<string, unknown> =
      await this.storageManager.getAllItems();

    return Object.keys(storageItems).reduce<ISettings>((acc, value) => {
      switch (value) {
        case SETTINGS_ADVANCED_KEY:
          return {
            ...acc,
            advanced: {
              ...acc.advanced,
              ...(storageItems[SETTINGS_ADVANCED_KEY] as IAdvancedSettings),
            },
          };
        case SETTINGS_APPEARANCE_KEY:
          return {
            ...acc,
            appearance: {
              ...acc.appearance,
              ...(storageItems[SETTINGS_APPEARANCE_KEY] as IAppearanceSettings),
            },
          };
        case SETTINGS_GENERAL_KEY:
          return {
            ...acc,
            general: {
              ...acc.general,
              ...(storageItems[SETTINGS_GENERAL_KEY] as IGeneralSettings),
            },
          };
        case SETTINGS_SECURITY_KEY:
          return {
            ...acc,
            security: {
              ...acc.security,
              ...(storageItems[SETTINGS_SECURITY_KEY] as ISecuritySettings),
            },
          };
        default:
          return acc;
      }
    }, SettingsService.initializeDefaultSettings());
  }

  /**
   * Saves all settings to storage.
   * @param {ISettings} settings - the settings to save.
   * @returns {ISettings} the saved settings.
   */
  public async saveAll(settings: ISettings): Promise<ISettings> {
    await this.storageManager.setItems({
      [SETTINGS_ADVANCED_KEY]: settings.advanced,
      [SETTINGS_APPEARANCE_KEY]: settings.appearance,
      [SETTINGS_GENERAL_KEY]: settings.general,
      [SETTINGS_SECURITY_KEY]: settings.security,
    });

    return settings;
  }
}
