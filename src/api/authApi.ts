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

export const signUpApi = async ({
  email,
  password,
  fullName,
  role,
}: SignUpInput) => {
  return signUp({
    username: email,
    password,
    options: { userAttributes: { email, name: fullName, "custom:role": role } },
  });
};

export type SignInInput = {
  email: string;
  password: string;
};

export const signInApi = async ({ email, password }: SignInInput) => {
  return signIn({
    username: email,
    password,
  });
};

export const signOutApi = async () => {
  return signOut();
};

export const confirmSignUpApi = async (email: string, code: string) => {
  return confirmSignUp({
    username: email,
    confirmationCode: code,
  });
};

export const resendCodeApi = async (email: string) => {
  return resendSignUpCode({ username: email });
};

export type ForgotPasswordInput = {
  email: string;
};

export const forgotPasswordApi = async ({ email }: ForgotPasswordInput) => {
  return resetPassword({ username: email });
};

export type ConfirmForgotPasswordInput = {
  email: string;
  code: string;
  newPassword: string;
};

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
