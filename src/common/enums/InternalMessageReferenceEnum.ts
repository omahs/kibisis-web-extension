enum InternalMessageReferenceEnum {
  // messages sent from the extension internally within the extension
  FactoryReset = 'internal:factory_reset',
  EventAdded = 'internal:event_added',
  PasswordLockEnabled = 'internal:password_lock_enabled',
  PasswordLockDisabled = 'internal:password_lock_disabled',
  PasswordLockTimeout = 'internal:password_lock_timeout',
  RegistrationCompleted = 'internal:registration_completed',
}

export default InternalMessageReferenceEnum;
