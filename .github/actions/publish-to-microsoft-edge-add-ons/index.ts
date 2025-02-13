import { info, setFailed } from '@actions/core';
import styles from 'ansi-styles';
import { Stats } from 'node:fs';
import { stat } from 'node:fs/promises';
import { resolve } from 'node:path';

// enums
import { ErrorCodeEnum } from './enums';

// errors
import { ActionError } from './errors';

// utils
import {
  createAccessToken,
  handleError,
  publish,
  uploadZipFile,
} from './utils';

(async () => {
  const infoPrefix: string = `${styles.yellow.open}[INFO]${styles.yellow.close}`;
  let accessToken: string;
  let operationId: string;
  let zipPath: string;
  let zipFileStats: Stats;

  if (!process.env.ACCESS_TOKEN_URL) {
    setFailed(`invalid input for environment variable "ACCESS_TOKEN_URL"`);

    process.exit(ErrorCodeEnum.InvalidInputError);
  }

  if (!process.env.CLIENT_ID) {
    setFailed(`invalid input for environment variable "CLIENT_ID"`);

    process.exit(ErrorCodeEnum.InvalidInputError);
  }

  if (!process.env.CLIENT_SECRET) {
    setFailed(`invalid input for environment variable "CLIENT_SECRET"`);

    process.exit(ErrorCodeEnum.InvalidInputError);
  }

  if (!process.env.PRODUCT_ID) {
    setFailed(`invalid input for environment variable "PRODUCT_ID"`);

    process.exit(ErrorCodeEnum.InvalidInputError);
  }

  if (!process.env.ZIP_FILE_NAME) {
    setFailed(`invalid input for environment variable "ZIP_FILE_NAME"`);

    process.exit(ErrorCodeEnum.InvalidInputError);
  }

  if (!process.env.GITHUB_WORKSPACE) {
    setFailed(`environment variable "GITHUB_WORKSPACE" not defined`);

    process.exit(ErrorCodeEnum.UnknownError);
  }

  try {
    zipPath = resolve(process.env.GITHUB_WORKSPACE, process.env.ZIP_FILE_NAME);
    zipFileStats = await stat(zipPath);

    // check if the file exists
    if (!zipFileStats.isFile()) {
      throw new ActionError(
        ErrorCodeEnum.FileNotFoundError,
        `zip file "${zipPath}" does not exist`
      );
    }

    info(`${infoPrefix} creating access token...`);

    accessToken = await createAccessToken(
      process.env.ACCESS_TOKEN_URL,
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET
    );

    info(`${infoPrefix} access token created`);
    info(
      `${infoPrefix} uploading add-on "${process.env.PRODUCT_ID}" with zip file "${zipPath}"`
    );

    operationId = await uploadZipFile(
      process.env.PRODUCT_ID,
      zipPath,
      accessToken
    );

    info(
      `${infoPrefix} successfully uploaded zip file with operation "${operationId}"`
    );
    info(`${infoPrefix} publishing add-on: ${process.env.PRODUCT_ID}`);

    operationId = await publish(process.env.PRODUCT_ID, accessToken);

    info(
      `${infoPrefix} successfully published add-on "${process.env.PRODUCT_ID}" with operation "${operationId}"`
    );
  } catch (error) {
    handleError(error);
  }
})();
