import {
  Heading,
  HStack,
  Input,
  InputGroup,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Account, mnemonicToSecretKey } from 'algosdk';
import { Step, useSteps } from 'chakra-ui-steps';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateFunction, useNavigate } from 'react-router-dom';

// components
import Button from '@extension/components/Button';
import EnterMnemonicPhraseInput, {
  validate,
} from '@extension/components/EnterMnemonicPhraseInput';
import PageHeader from '@extension/components/PageHeader';
import Steps from '@extension/components/Steps';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import { IAddAccountCompleteFunction } from '@extension/types';

interface IProps {
  onComplete: IAddAccountCompleteFunction;
  saving: boolean;
}

const ImportExistingAccountPage: FC<IProps> = ({
  onComplete,
  saving,
}: IProps) => {
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColor: string = usePrimaryColor();
  const primaryColorScheme: string = usePrimaryColorScheme();
  const subTextColor: string = useSubTextColor();
  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: 0,
  });
  const [account, setAccount] = useState<Account | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [phrases, setPhrases] = useState<string[]>(
    Array.from({ length: 25 }, () => '')
  );
  const stepsLabels: string[] = [
    t<string>('headings.enterYourSeedPhrase'),
    t<string>('headings.nameYourAccount'),
  ];
  const hasCompletedAllSteps: boolean = activeStep === stepsLabels.length;
  const handleImportClick = () => {
    if (!account) {
      // TODO: handle eventuality if the account is not defined
      return;
    }

    onComplete({
      name: name !== account.addr ? name : null, //  if the address is the same as the name, ignore
      privateKey: account.sk,
    });
  };
  const handleOnMnemonicPhraseChange = (value: string[]) => setPhrases(value);
  const handleOnNameChange = (event: ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);
  const handleNextClick = () => {
    let validateError: string | null;

    // if this is the first step, validate the mnemonic
    if (activeStep <= 0) {
      validateError = validate(phrases, t);

      setError(validateError);

      // if we have an error, deny the next step
      if (validateError) {
        return;
      }

      setAccount(mnemonicToSecretKey(phrases.join(' ')));
    }

    nextStep();
  };
  const handlePreviousClick = () => {
    // if the step is on the first step, navigate back
    if (activeStep <= 0) {
      navigate(-1);

      return;
    }

    prevStep();
  };

  useEffect(() => {
    if (account && !name) {
      setName(account.addr);
    }
  }, [account]);

  return (
    <>
      <PageHeader
        title={t<string>('titles.page', { context: 'importExistingAccount' })}
      />
      <VStack
        flexGrow={1}
        justifyContent="center"
        pb={DEFAULT_GAP}
        px={DEFAULT_GAP}
        spacing={2}
        w="full"
      >
        <Steps
          activeStep={activeStep}
          colorScheme={primaryColorScheme}
          flexGrow={0}
          orientation="vertical"
          variant="circles"
        >
          {/* Enter mnemonic */}
          <Step label={stepsLabels[0]}>
            <VStack alignItems="flex-start" p={1} spacing={2} w="full">
              <Text color={subTextColor} size="md" textAlign="left">
                {t<string>('captions.enterSeedPhrase')}
              </Text>
              <EnterMnemonicPhraseInput
                disabled={saving}
                error={error}
                onChange={handleOnMnemonicPhraseChange}
                phrases={phrases}
              />
            </VStack>
          </Step>
          {/* Name account */}
          <Step label={stepsLabels[1]}>
            <VStack alignItems="flex-start" p={1} spacing={2} w="full">
              <Text color={subTextColor} size="md" textAlign="left">
                {t<string>('captions.nameYourAccount')}
              </Text>
              <VStack w="full">
                <Text color={defaultTextColor} textAlign="left" w="full">
                  {t<string>('labels.accountName')}
                </Text>
                <InputGroup size="md">
                  <Input
                    focusBorderColor={primaryColor}
                    isDisabled={saving}
                    onChange={handleOnNameChange}
                    placeholder={t<string>('placeholders.nameAccount')}
                    type="text"
                    value={name || ''}
                  />
                </InputGroup>
              </VStack>
            </VStack>
          </Step>
        </Steps>

        {/* Confirm completed */}
        {hasCompletedAllSteps && (
          <VStack alignItems="flex-start" spacing={2} w="full">
            <Heading color={defaultTextColor} fontSize="md" textAlign="left">
              {t<string>('headings.importExistingAccountComplete')}
            </Heading>
            <Text color={subTextColor} fontSize="md" textAlign="left">
              {t<string>('captions.importExistingAccountComplete')}
            </Text>
          </VStack>
        )}

        <Spacer />

        <HStack spacing={4} w="full">
          <Button
            onClick={handlePreviousClick}
            isDisabled={saving}
            size="lg"
            variant="outline"
            w="full"
          >
            {t<string>('buttons.previous')}
          </Button>
          {hasCompletedAllSteps ? (
            <Button
              onClick={handleImportClick}
              isLoading={saving}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.import')}
            </Button>
          ) : (
            <Button
              onClick={handleNextClick}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.next')}
            </Button>
          )}
        </HStack>
      </VStack>
    </>
  );
};

export default ImportExistingAccountPage;
