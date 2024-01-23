import { generateAccount } from 'algosdk';
import { HStack, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react';
import React, { FC } from 'react';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// utils
import ellipseAddress from '@extension/utils/ellipseAddress';

const WalletConnectModalBodySkeleton: FC = () => {
  // hooks
  const defaultTextColor: string = useDefaultTextColor();

  return (
    <>
      {Array.from({ length: 3 }, (_, index) => (
        <HStack
          key={`wallet-connect-modal-fetching-item-${index}`}
          py={4}
          spacing={4}
          w="full"
        >
          <SkeletonCircle size="12" />
          <Skeleton flexGrow={1}>
            <Text color={defaultTextColor} fontSize="md" textAlign="center">
              {ellipseAddress(generateAccount().addr, {
                end: 10,
                start: 10,
              })}
            </Text>
          </Skeleton>
        </HStack>
      ))}
    </>
  );
};

export default WalletConnectModalBodySkeleton;
