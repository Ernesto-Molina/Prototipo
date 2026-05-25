import { createContext, useContext } from 'react';

export const AngelContext = createContext();

export const useAngel = () => useContext(AngelContext);