import { signUp } from "@aws-amplify/auth";
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
