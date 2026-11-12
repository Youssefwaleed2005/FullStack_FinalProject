import { useContext } from "react";
import { MyLearningContext } from "@/lib/myLearningContext";

export function useMyLearning() {
  const context = useContext(MyLearningContext);
  if (!context) {
    throw new Error("useMyLearning must be used inside a MyLearningProvider.");
  }
  return context;
}
