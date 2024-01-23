import {
  Box,
  Button,
  Heading,
  HStack,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoOpenOutline } from 'react-icons/io5';

// components
import SessionAvatar from '@extension/components/SessionAvatar';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// theme
import { theme } from '@extension/theme';

// types
import { INetwork } from '@extension/types';

// utils
import isValidUrl from '@common/utils/isValidUrl';

interface IProps {
  description?: string;
  host: string;
  iconUrl?: string;
  isWalletConnect?: boolean;
  name: string;
  network?: INetwork;
}

const SessionRequestHeader: FC<IProps> = ({
  description,
  host,
  iconUrl,
  isWalletConnect = false,
  name,
}: IProps) => {
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColorScheme: string = usePrimaryColorScheme();
  const textBackgroundColor: string = useTextBackgroundColor();

  return (
    <VStack alignItems="center" spacing={5} w="full">
      <HStack alignItems="center" justifyContent="center" spacing={4} w="full">
        {/*app icon */}
        <SessionAvatar
          iconUrl={iconUrl}
          name={name}
          isWalletConnect={isWalletConnect}
        />

        <VStack
          alignItems="flex-start"
          flex={1}
          justifyContent="space-evenly"
          w="full"
        >
          {/*name*/}
          <Heading color={defaultTextColor} size="md" textAlign="left">
            {name}
          </Heading>

          {/*host*/}
          {isValidUrl(host) ? (
            <Button
              aria-label="Open host in external webpage"
              as={Link}
              colorScheme={primaryColorScheme}
              fontSize="sm"
              href={host}
              rightIcon={<IoOpenOutline />}
              target="_blank"
              variant="link"
            >
              {host}
            </Button>
          ) : (
            <Box
              backgroundColor={textBackgroundColor}
              borderRadius={theme.radii['3xl']}
              px={DEFAULT_GAP / 3}
              py={1}
            >
              <Text
                color={defaultTextColor}
                fontSize="sm"
                maxW={250}
                noOfLines={1}
                textAlign="left"
              >
                {host}
              </Text>
            </Box>
          )}
        </VStack>
      </HStack>

      {/*app description*/}
      {description && (
        <Text color={defaultTextColor} fontSize="sm" textAlign="center">
          {description}
        </Text>
      )}
    </VStack>
  );
};

export default SessionRequestHeader;
