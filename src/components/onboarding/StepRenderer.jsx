import React from "react";

import Step1_BasicInfo from "./Step1_BasicInfo";
import Step2_GoalsExperience from "./Step2_GoalsExperience";
import Step3_HealthLifestyle from "./Step3_HealthLifestyle";
import Step4_MotivationUploads from "./Step4_MotivationUploads";
import Step5_SummarySubmit from "./Step5_SummarySubmit";

export default function Renderer({
  step,
  profile,
  updateField,
  toggleGoal,
  handleFileChange,
}) {
  switch (step) {
    case 0:
      return (
        <Step1_BasicInfo profile={profile} updateField={updateField} />
      );
    case 1:
      return (
        <Step2_GoalsExperience
          profile={profile}
          updateField={updateField}
          toggleGoal={toggleGoal}
        />
      );
    case 2:
      return (
        <Step3_HealthLifestyle profile={profile} updateField={updateField} />
      );
    case 3:
      return (
        <Step4_MotivationUploads
          profile={profile}
          updateField={updateField}
          handleFileChange={handleFileChange}
        />
      );
    case 4:
      return <Step5_SummarySubmit profile={profile} />;
    default:
      return null;
  }
}
