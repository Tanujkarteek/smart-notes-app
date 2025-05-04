import { useContext, useState } from "react";
import { OnboardingContext } from "../../context/OnboardingContext";

const OnboardingSteps = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { completeOnboarding } = useContext(OnboardingContext);

  const steps = [
    {
      title: "Welcome to Smart Notes",
      content: "Let's get you started with your note-taking journey",
    },
    {
      title: "Create Your First Note",
      content: 'Click the "Create New Note" button to create a new note',
    },
    {
      title: "Organize Your Notes",
      content: "Use tags and categories to keep your notes organized",
    },
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        await completeOnboarding();
        localStorage.setItem("hasCompletedOnboarding", "true");
        window.location.reload(); // Reload to reflect changes
      } catch (error) {
        console.error("Failed to complete onboarding:", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md">
        <h2 className="text-xl font-bold mb-4">{steps[currentStep].title}</h2>
        <p className="mb-4">{steps[currentStep].content}</p>
        <div className="flex justify-between">
          <button
            onClick={handleNext}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            {currentStep === steps.length - 1 ? "Get Started" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSteps;
