import React from "react";
import { completeOnboarding as completeOnboardingAPI } from "../services/authService";

interface OnboardingContextType {
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => Promise<void>;
}

export const OnboardingContext = React.createContext<OnboardingContextType>({
  hasCompletedOnboarding: false,
  completeOnboarding: () => completeOnboarding(),
});

export const completeOnboarding = async () => {
  try {
    await completeOnboardingAPI();
    localStorage.setItem("hasCompletedOnboarding", "true");
  } catch (error) {
    console.error("Error completing onboarding:", error);
    throw error; // Re-throw to handle in the component
  }
};
