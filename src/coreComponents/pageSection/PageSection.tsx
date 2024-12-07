import React from "react";
import "./page-section.scss";
export type PageSectionProps = {
  children?: React.ReactNode;
};

export const PageSection: React.FC<PageSectionProps> = ({ children }) => {
  return <div className="page-section-container">{children}</div>;
};
