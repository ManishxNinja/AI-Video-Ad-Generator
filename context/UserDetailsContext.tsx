import { createContext } from "react";
import { Id } from "@/convex/_generated/dataModel"

export type UserDetail = {
  _id: Id<'users'>;
  name: string;
  email: string;
  picture?: string;
};

type UserDetailContextType = {
  userDetail: UserDetail | null;
  setUserDetail: React.Dispatch<React.SetStateAction<UserDetail | null>>;
}

export const UserDetailsContext = createContext<UserDetailContextType | null>(null);