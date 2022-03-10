import { createContext } from "react";

export const attemptLoginContext = createContext(false);
export const xTokenContext = createContext(null);

export const DateContext = createContext("");
export const sessionsContext = createContext([]);
export const prevSessionsContext = createContext([]);
export const clientsContext = createContext({});

export const ScheduleDismissContext = createContext(true);

export const CurrentUserContext = createContext({});