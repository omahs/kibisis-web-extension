import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { encode as encodeHex } from '@stablelib/hex';
import { NavigateFunction } from 'react-router-dom';
import { sign } from 'tweetnacl';
import browser from 'webextension-polyfill';

// constants
import { CREATE_PASSWORD_ROUTE } from '@extension/constants';

// enums
import { RegisterThunkEnum } from '@extension/enums';

// errors
import { BaseExtensionError, MalformedDataError } from '@extension/errors';

// features
import { setError } from '@extension/features/system';
import { sendRegistrationCompletedThunk } from '@extension/features/messages';

// services
import AccountService from '@extension/services/AccountService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import { ILogger } from '@common/types';
import {
  IAccount,
  IPrivateKey,
  IRegistrationRootState,
} from '@extension/types';
import { ISaveCredentialsPayload } from '../types';

const saveCredentialsThunk: AsyncThunk<
  void, // return
  ISaveCredentialsPayload, // args
  Record<string, never>
> = createAsyncThunk<
  void,
  ISaveCredentialsPayload,
  { state: IRegistrationRootState }
>(
  RegisterThunkEnum.SaveCredentials,
  async ({ name, privateKey }, { dispatch, getState }) => {
    const logger: ILogger = getState().system.logger;
    const navigate: NavigateFunction | null = getState().system.navigate;
    const password: string | null = getState().registration.password;
    let account: IAccount;
    let accountService: AccountService;
    let encodedPublicKey: string;
    let inputError: BaseExtensionError;
    let privateKeyItem: IPrivateKey | null;
    let privateKeyService: PrivateKeyService;

    if (!password) {
      inputError = new MalformedDataError('no password found');

      logger.error(
        `${RegisterThunkEnum.SaveCredentials}: ${inputError.message}`
      );

      navigate && navigate(CREATE_PASSWORD_ROUTE);

      throw inputError;
    }

    try {
      logger.debug(
        `${RegisterThunkEnum.SaveCredentials}: inferring public key`
      );

      encodedPublicKey = encodeHex(
        sign.keyPair.fromSecretKey(privateKey).publicKey
      );
      privateKeyService = new PrivateKeyService({
        logger,
        passwordTag: browser.runtime.id,
      });

      logger.debug(
        `${RegisterThunkEnum.SaveCredentials}: saving private key "${encodedPublicKey}" to storage`
      );

      // reset any previous credentials, set the password and the account
      await privateKeyService.reset();
      await privateKeyService.setPassword(password);

      privateKeyItem = await privateKeyService.setPrivateKey(
        privateKey,
        password
      );
    } catch (error) {
      logger.error(`${RegisterThunkEnum.SaveCredentials}: ${error.message}`);

      dispatch(setError(error));

      throw error;
    }

    logger.debug(
      `${RegisterThunkEnum.SaveCredentials}: successfully saved credentials`
    );

    account = AccountService.initializeDefaultAccount({
      publicKey: encodedPublicKey,
      ...(privateKeyItem && {
        createdAt: privateKeyItem.createdAt,
      }),
      ...(name && {
        name,
      }),
    });
    accountService = new AccountService({
      logger,
    });

    // save the account to storage
    await accountService.saveAccounts([account]);

    logger.debug(
      `${RegisterThunkEnum.SaveCredentials}: saved account for "${encodedPublicKey}" to storage`
    );

    // send a message that registration has been completed
    dispatch(sendRegistrationCompletedThunk());
  }
);

export default saveCredentialsThunk;
