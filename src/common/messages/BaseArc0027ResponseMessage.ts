// enums
import { Arc0027MessageReferenceEnum } from '@common/enums';

// errors
import { BaseSerializableArc0027Error } from '@common/errors';

// messages
import BaseMessage from './BaseMessage';

export default class BaseArc0027ResponseMessage<
  Result
> extends BaseMessage<Arc0027MessageReferenceEnum> {
  public readonly error: BaseSerializableArc0027Error | null;
  public readonly requestId: string;
  public readonly result: Result | null;

  constructor(
    reference: Arc0027MessageReferenceEnum,
    requestId: string,
    error: BaseSerializableArc0027Error | null,
    result: Result | null
  ) {
    super(reference);

    this.error = error;
    this.requestId = requestId;
    this.result = result;
  }
}
