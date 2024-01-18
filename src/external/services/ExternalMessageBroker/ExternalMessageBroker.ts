import browser from 'webextension-polyfill';

// enums
import { Arc0027MessageReferenceEnum } from '@common/enums';

// messages
import {
  BaseArc0027RequestMessage,
  BaseArc0027ResponseMessage,
} from '@common/messages';

// types
import type {
  IArc0027ParamTypes,
  IArc0027ResultTypes,
  IBaseOptions,
  IClientInformation,
  ILogger,
} from '@common/types';

// utils
import extractFaviconUrl from '@external/utils/extractFaviconUrl';

interface IOptions extends IBaseOptions {
  channel: BroadcastChannel;
}

export default class ExternalMessageBroker {
  // private variables
  private readonly channel: BroadcastChannel;
  private readonly logger: ILogger | null;

  constructor({ channel, logger }: IOptions) {
    this.channel = channel;
    this.logger = logger || null;
  }

  /**
   * private functions
   */

  /**
   * Convenience function create the client information content for the webpage.
   * * appName - uses the content of the "application-name" meta tag, if this doesn't exist, it falls back to the document title.
   * * description - uses the content of the "description" meta tag, if it exists.
   * * host - uses host of the web page.
   * * iconUrl - uses the favicon of the web page.
   * @returns {IClientInformation} the client information.
   * @private
   */
  private createClientInformation(): IClientInformation {
    return {
      appName:
        document
          .querySelector('meta[name="application-name"]')
          ?.getAttribute('content') || document.title,
      description:
        document
          .querySelector('meta[name="description"]')
          ?.getAttribute('content') || null,
      host: `${window.location.protocol}//${window.location.host}`,
      iconUrl: extractFaviconUrl(),
    };
  }

  /**
   * public functions
   */

  public async onArc0027RequestMessage(
    message: MessageEvent<BaseArc0027RequestMessage<IArc0027ParamTypes>>
  ): Promise<void> {
    const _functionName: string = 'onArc0027RequestMessage';

    switch (message.data.reference) {
      case Arc0027MessageReferenceEnum.EnableRequest:
      case Arc0027MessageReferenceEnum.GetProvidersRequest:
      case Arc0027MessageReferenceEnum.SignBytesRequest:
      case Arc0027MessageReferenceEnum.SignTxnsRequest:
        this.logger?.debug(
          `${ExternalMessageBroker.name}#${_functionName}(): request message "${message.data.reference}" received`
        );

        // send the message to the main app (popup) or the background service
        return await browser.runtime.sendMessage({
          clientInfo: this.createClientInformation(),
          data: message.data,
        });
      default:
        break;
    }
  }

  public onArc0027ResponseMessage(
    message: BaseArc0027ResponseMessage<IArc0027ResultTypes>
  ): void {
    const _functionName: string = 'onArc0027ResponseMessage';

    switch (message.reference) {
      case Arc0027MessageReferenceEnum.EnableResponse:
      case Arc0027MessageReferenceEnum.GetProvidersResponse:
      case Arc0027MessageReferenceEnum.SignBytesResponse:
      case Arc0027MessageReferenceEnum.SignTxnsResponse:
        this.logger?.debug(
          `${ExternalMessageBroker.name}#${_functionName}(): response message "${message.reference}" received`
        );

        // broadcast the response to the webpage
        return this.channel.postMessage(message);
      default:
        break;
    }
  }
}
