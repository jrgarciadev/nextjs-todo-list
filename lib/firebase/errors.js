// Firebase knows errors
export default {
  'auth/invalid-email': 'The email address is badly formatted.',
  'auth/wrong-password': 'The password is invalid or the user does not have a password.',
  'auth/user-not-found':
    'There is no user record corresponding to this identifier. Sign up and retry',
  'auth/email-already-in-use': 'The email address is already in use by another account.',
  'auth/account-exists-with-different-credential':
    'The email address is already in use by another account.',
  'auth/app-not-authorized': 'Not authorized to use Authentication with the provided API KEY.',
  'auth/argument-error': 'ncorrect arguments.',
  'auth/invalid-user-token':
    "Thrown if the user's credential is no longer valid. The user must sign in again.",
  'auth/invalid-tenant-id': 'Tenant ID provided is invalid.',
  'auth/network-request-failed': 'Network error has occurred.',
  'auth/operation-not-allowed': 'Operation not allowed',
  'auth/requires-recent-login': 'Last sign-in time does not meet the security threshold',
  'auth/too-many-requests':
    'Request blocked for unusual activity. Trying again after some delay would unblock.',
  'auth/unauthorized-domain':
    'App domain is not authorized for OAuth operations for your Firebase project.',
  'auth/user-disabled': 'User account has been disabled by an administrator.',
  'auth/user-token-expired': 'Your credentials has has expired',
};
