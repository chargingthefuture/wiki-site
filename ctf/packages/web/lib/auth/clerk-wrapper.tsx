'use client';

import type { FC } from 'react';
import {
  ClerkProvider as ClerkProviderBase,
  SignIn as SignInBase,
  SignUp as SignUpBase,
  SignedIn as SignedInBase,
  SignedOut as SignedOutBase,
  SignInButton as SignInButtonBase,
  UserButton as UserButtonBase,
  useUser as useClerkUser,
} from '@clerk/nextjs';

const isAuthDisabled = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true';

type ClerkProviderProps = React.ComponentProps<typeof ClerkProviderBase>;
type SignInProps = React.ComponentProps<typeof SignInBase>;
type SignUpProps = React.ComponentProps<typeof SignUpBase>;
type SignedInProps = React.ComponentProps<typeof SignedInBase>;
type SignedOutProps = React.ComponentProps<typeof SignedOutBase>;
type SignInButtonProps = React.ComponentProps<typeof SignInButtonBase>;
type UserButtonProps = React.ComponentProps<typeof UserButtonBase>;

export const ClerkProvider: FC<ClerkProviderProps> = ({ children, ...props }) => {
  if (isAuthDisabled) {
    return <>{children}</>;
  }
  return <ClerkProviderBase {...props}>{children}</ClerkProviderBase>;
};

export const SignIn: FC<SignInProps> = (props) => {
  if (isAuthDisabled) {
    return <div style={{ padding: 20 }}>Auth disabled (SignIn)</div>;
  }
  return <SignInBase {...props} />;
};

export const SignUp: FC<SignUpProps> = (props) => {
  if (isAuthDisabled) {
    return <div style={{ padding: 20 }}>Auth disabled (SignUp)</div>;
  }
  return <SignUpBase {...props} />;
};

export const SignedIn: FC<SignedInProps> = ({ children, ...props }) => {
  if (isAuthDisabled) {
    return <>{children}</>;
  }
  return <SignedInBase {...props}>{children}</SignedInBase>;
};

export const SignedOut: FC<SignedOutProps> = ({ children, ...props }) => {
  if (isAuthDisabled) {
    return null;
  }
  return <SignedOutBase {...props}>{children}</SignedOutBase>;
};

export const SignInButton: FC<SignInButtonProps> = ({ children, ...props }) => {
  if (isAuthDisabled) {
    return <>{children}</>;
  }
  return <SignInButtonBase {...props}>{children}</SignInButtonBase>;
};

export const UserButton: FC<UserButtonProps> = (props) => {
  if (isAuthDisabled) {
    return <button type="button">User</button>;
  }
  return <UserButtonBase {...props} />;
};

export function useUser() {
  const clerkUser = useClerkUser();
  
  if (isAuthDisabled) {
    return {
      user: {
        id: 'dev_user',
        firstName: 'Dev',
        username: 'dev',
        imageUrl: null,
      },
    };
  }

  return clerkUser;
}
