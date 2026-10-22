import { createContext } from "react";

export type Celebration = {
  title: string;
  message?: string;
  emoji?: string;
  big?: boolean; // big = three confetti cannons + longer toast
};

export type CelebrationContextValue = {
  celebrate: (celebration: Celebration) => void;
};

export const CelebrationContext = createContext<CelebrationContextValue>({
  celebrate: () => {},
});
