import { useContext } from "react";
import { CelebrationContext } from "@/lib/celebrationContext";

// celebrate({ title, message, big }) → confetti + a friendly toast
export function useCelebrate() {
  return useContext(CelebrationContext);
}
