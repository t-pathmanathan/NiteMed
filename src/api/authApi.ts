/**
 * authApi
 *
 * Wrapper functions for AWS Amplify authentication flows used throughout
 * the application, including sign up, sign in, password reset, and sign out.
 */

import {
  confirmResetPassword,
  confirmSignUp,
  resendSignUpCode,
  resetPassword,
  signIn,
  signOut,
  signUp,
} from "@aws-amplify/auth";

export type SignUpInput = {
  email: string;
  password: string;
  fullName: string;
  role: string;
};

/** Registers a new user with Cognito */
export const signUpApi = async ({
  email,
  password,
  fullName,
  role,
}: SignUpInput) => {
  return signUp({
    username: email,
    password,
    options: {
      userAttributes: {
        email,
        name: fullName,
        "custom:role": role,
      },
    },
  });
};

export type ConfirmSignUpInput = {
  email: string;
  code: string;
};

/** Confirms a user's sign-up using the verification code */
export const confirmSignUpApi = async ({ email, code }: ConfirmSignUpInput) => {
  return confirmSignUp({
    username: email,
    confirmationCode: code,
  });
};

export type ResendSignUpCodeInput = {
  email: string;
};

/** Resends the Cognito sign-up verification code */
export const resendCodeApi = async ({ email }: ResendSignUpCodeInput) => {
  return resendSignUpCode({ username: email });
};

export type SignInInput = {
  email: string;
  password: string;
};

/** Signs an existing user into the application */
export const signInApi = async ({ email, password }: SignInInput) => {
  return signIn({
    username: email,
    password,
  });
};

export type ForgotPasswordInput = {
  email: string;
};

/** Starts the forgot password flow for a user */
export const forgotPasswordApi = async ({ email }: ForgotPasswordInput) => {
  return resetPassword({ username: email });
};

export type ConfirmForgotPasswordInput = {
  email: string;
  code: string;
  newPassword: string;
};

/** Confirms a password reset using the verification code */
export const confirmForgotPasswordApi = async ({
  email,
  code,
  newPassword,
}: ConfirmForgotPasswordInput) => {
  return confirmResetPassword({
    username: email,
    confirmationCode: code,
    newPassword,
  });
};

/** Signs the current user out of the application */
export const signOutApi = async () => {
  return signOut();
};
