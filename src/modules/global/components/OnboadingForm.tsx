import { useState, useMemo } from "react";
import AddProfileDetails from "./onboardingStep/components/AddProfileDetails";
import AddGoals from "./onboardingStep/components/AddGoals";
import AddGrowthConversation from "./onboardingStep/components/AddGrowthConversation";
import AddRecognition from "./onboardingStep/components/AddRecognition";
import AddVideoTour from "./onboardingStep/components/AddVideoTour";
import { useSelector } from "react-redux";
import { Container } from "@mui/material";

const OnboadingForm = ({profile,profileIsLoading,profileIsError,profileRefetch}:any) => {
  const [step, setStep] = useState(0);
  const userData = useSelector(
    (state: any) => state.auth?.userData["custom:isAdmin"]
  );

  const steps = useMemo(() => {
    const baseSteps = [
      {
        title: "Video Tour",
        description: "Watch the video tour to learn more.",
      },
      {
        title: "Profile",
        description:
          "Fill in your profile information, add a professional profile picture, give your contact number, and a brief details about who you are and what you like. Use this as a crisp elevator pitch about your profile to someone else.",
      },
      {
        title: "Goals",
        description:
          "A goal is a specific target or desired outcome that you strive to achieve through focused effort and action. A Goal consists of multiple tasks. A task is an atomic step that needs to be completed in order to achieve the overall goal. Tasks are the smaller, actionable items that contribute to progress toward reaching the goal.",
      },
      {
        title: "Recognition",
        description:
          "Recognize your team's efforts. You can select a badge, mention whom do you want to recognize, and give a detailed accolade to appreciate someone's work. (Please do not mention any confidential information)",
      },
    ];

    if (profile?.data?.reportsTo) {
      baseSteps.splice(3, 0, {
        title: "Growth Conversation",
        description:
          "A growth conversation is a discussion between you and your manager focused on personal or professional development. It involves setting goals and planning actionable steps to foster growth and career advancement.",
      });
    }

    return baseSteps;
  }, [userData]);

  const optionalSteps = useMemo(() => {
    return steps.length === 5 ? [1, 2, 3, 4] : [1, 2, 3];
  }, [steps]);

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const skipStep = () => {
    if (optionalSteps.includes(step) && step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const renderStepComponent = () => {
    const currentTitle = steps[step]?.title;
    switch (currentTitle) {
      case "Video Tour":
        return <AddVideoTour nextStep={nextStep} skipStep={skipStep} />;
      case "Profile":
        return (
          <AddProfileDetails
            nextStep={nextStep}
            prevStep={prevStep}
            skipStep={skipStep}
            profile={profile}
            profileIsLoading={profileIsLoading}
            profileIsError={profileIsError}
            profileRefetch={profileRefetch}
          />
        );
      case "Goals":
        return (
          <AddGoals
            nextStep={nextStep}
            prevStep={prevStep}
            skipStep={skipStep}
          />
        );
      case "Growth Conversation":
        return (
          <AddGrowthConversation
            nextStep={nextStep}
            prevStep={prevStep}
            skipStep={skipStep}
          />
        );
      case "Recognition":
        return (
          <AddRecognition
            nextStep={nextStep}
            prevStep={prevStep}
            skipStep={skipStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <div className="w-full mt-[75px]">
        <p className="text-2xl text-[#4F4F51] mb-3">Wazo Onboarding Steps</p>

        <div className="flex gap-3">
          {/* Left column */}
          <div className="w-[20%] border-r border-[#E8E8EC] pr-3">
            <div className="flex flex-col gap-4">
              {steps.map((stepItem, index) => (
                <div
                  key={index}
                  className={`cursor-pointer p-3 rounded-md transition duration-200 border-l-4
                  ${
                    index === step
                      ? "bg-[#585DF9]/10 border-[#585DF9] text-[#585DF9]"
                      : "bg-gray-100 border-transparent text-[#73737D] hover:bg-gray-200"
                  }`}
                  // onClick={() => setStep(index)}
                >
                  <div className="text-sm font-semibold">{`Step ${index + 1}: ${
                    stepItem.title
                  }`}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Center column */}
          <div
            className="w-[60%] bg-white p-3 rounded-md flex flex-col justify-between"
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
          >
            {renderStepComponent()}
          </div>

          {/* Right column */}
          <div className="w-[20%] border-l border-[#E8E8EC] pl-3">
            <p className="text-xl font-semibold text-[#73737D] mb-2">
              {steps[step]?.title}
            </p>
            <p>{steps[step]?.description}</p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default OnboadingForm;
