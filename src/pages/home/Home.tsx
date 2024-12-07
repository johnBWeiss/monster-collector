import React, { FC } from "react";
import { WelcomeSection } from "./components/welcomeSection/welcomeSection";
import { PageSection } from "../../coreComponents/pageSection/PageSection";
export type HomeProps = {};

export const Home: FC<HomeProps> = () => {
  return (
    <PageSection>
      <WelcomeSection />
    </PageSection>
  );
};
