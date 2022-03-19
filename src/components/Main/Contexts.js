import { createContext } from "react";

export const xTokenContext = createContext(null);

export const DateContext = createContext("");
export const sessionsContext = createContext([]);
export const prevSessionsContext = createContext([]);
export const clientsContext = createContext({});

export const ScheduleDismissContext = createContext(true);

/*type TUser = {
    _id: string;
    email: string;
    verified: boolean; // for email
    firstName: string;
    lastName: string;
    sessions: number; // scheduling tickets, basically.
    admin: boolean; // web host interface
    trainer: boolean; // trainer interface
}
interface IUser {
    _user: TUser;
	_setUser?: () => void;
}*/
export const CurrentUserContext = createContext/*<IUser>*/(null);