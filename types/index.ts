export interface UserDocument {
  _id: string;
  id: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  role?: string;
  dateJoined?: Date;
  __v?: number;
  correctPassword?: (
    candidatePassword: string,
    userPassword: string,
  ) => Promise<boolean>;
}

export interface CookieOptions {
  expires: Date;
  secure?: boolean;
  httpOnly: boolean;
  sameSite?: "strict" | "lax" | "none";
}

export type signUpdataPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: {
    value: string;
    countryCode: string;
  };
  type: "SEAFARER" | "THERAPIST";
};
