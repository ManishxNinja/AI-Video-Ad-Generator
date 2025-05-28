import { createContext } from "react";

type UserDetail = {
  _id: string;
  name: string;
  email: string;
  picture?: string;
};

type UserDetailContextType = {
  userDetail: UserDetail | null;
  setUserDetail: React.Dispatch<React.SetStateAction<UserDetail | null>>;
}

export const UserDetailsContext = createContext<UserDetailContextType | null>(null);