import React, { useState, useEffect, useContext, ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { OnboardingContext } from "./OnboardingContext";
import OnboardingSteps from "../components/onboarding/onboardingSteps";
import { completeOnboarding } from "./OnboardingContext";

const OnboardingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [hasCompletedOnboardingUser, setHasCompletedOnboardingUser] =
    useState(false);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    // Check localStorage for onboarding status
    const status = localStorage.getItem("hasCompletedOnboarding");
    if (status) {
      setHasCompletedOnboardingUser(JSON.parse(status));
    }
  }, []);

  const handleCompleteOnboarding = async () => {
    try {
      await completeOnboarding();
      setHasCompletedOnboardingUser(true);
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
  };
  console.log(
    "OnboardingProvider - hasCompletedOnboardingUser:",
    hasCompletedOnboardingUser
  );
  console.log(
    "OnboardingProvider - currentUser:",
    currentUser?.hasCompletedOnboarding
  );

  return (
    <OnboardingContext.Provider
      value={{
        hasCompletedOnboarding: hasCompletedOnboardingUser,
        completeOnboarding: handleCompleteOnboarding,
      }}
    >
      {children}
      {currentUser && !currentUser.hasCompletedOnboarding && (
        <OnboardingSteps />
      )}
    </OnboardingContext.Provider>
  );
};

export default OnboardingProvider;
