import React from "react";
import { TextCore } from "../../../../coreComponents/textCore/TextCore";
import "./welcome-section.scss";
import { ButtonCore } from "../../../../coreComponents/buttonCore/ButtonCore";
import { classNameParserCore } from "../../../../coreFunctions/classNameParserCore/classNameParserCore";
import { NAVIGATION_PATHS } from "../../../../coreFunctions/navigation";
import { useNavigate } from "react-router";

export type WelcomeSectionProps = {};

export const WelcomeSection: React.FC<WelcomeSectionProps> = () => {
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    navigate(path); // Navigate to the inventory page
  };
  return (
    <div className="flex height-100 width-100">
      <div className="welcome-section-image-container border-radius-16">
        <div className="welcome-section-image"></div>
      </div>
      <div className="welcome-section-content">
        <div
          className={classNameParserCore(
            "flex flex-column gap-4 justify-center align-center",
          )}
        >
          <TextCore text="Robo builder" color="white" fontSize={60} />
          <TextCore text="avatar creator" color="white" fontSize={20} />
          <div className="p-top-50">
            <ButtonCore
              text="Sign in"
              onClick={
                () => {}
                // navigateTo(`/${NAVIGATION_PATHS.inventory}`)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
