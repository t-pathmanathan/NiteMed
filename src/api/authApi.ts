import { confirmSignUp, resendSignUpCode, signUp } from "@aws-amplify/auth";
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

export const confirmSignUpApi = async (email: string, code: string) => {
  return confirmSignUp({
    username: email,
    confirmationCode: code,
  });
};

export const resendCodeApi = async (email: string) => {
  return resendSignUpCode({ username: email });
};
