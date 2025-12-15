import { signUpApi, SignUpInput } from "../api/authApi";
export const registerUser = async (input: SignUpInput): Promise<void> => {
  const result = await signUpApi(input);
};
