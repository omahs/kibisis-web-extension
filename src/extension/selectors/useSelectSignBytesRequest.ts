import { useSelector } from 'react-redux';

// messages
import { Arc0027SignBytesRequestMessage } from '@common/messages';

// types
import { IClientRequest, IMainRootState } from '@extension/types';

/**
 * Selects the current sign bytes request, or null if none exists.
 * @returns {IClientRequest<Arc0027SignBytesRequestMessage> | null} the current sign bytes request or null if it does not exist.
 */
export default function useSelectSignBytesRequest(): IClientRequest<Arc0027SignBytesRequestMessage> | null {
  return useSelector<
    IMainRootState,
    IClientRequest<Arc0027SignBytesRequestMessage> | null
  >((state) => state.events.signBytesRequest);
}
