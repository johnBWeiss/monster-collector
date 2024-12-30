import React, { useEffect, useState } from "react";
import "./pop-ups.scss";
import { popUpController } from "../../Controllers/PopUpController";

type PopUp = {
  id: string;
  content: React.ReactNode;
};

export const PopUps: React.FC = () => {
  const [popUps, setPopUps] = useState<PopUp[]>([]);

  useEffect(() => {
    const handleShowPopUp = (popUp: PopUp) => {
      setPopUps((prev) => [...prev, popUp]);
    };

    const handleClosePopUp = ({ id }: { id: string }) => {
      setPopUps((prev) => prev.filter((popUp) => popUp.id !== id));
    };

    popUpController.on("showPopUp", handleShowPopUp);
    popUpController.on("closePopUp", handleClosePopUp);

    return () => {
      popUpController.off("showPopUp", handleShowPopUp);
      popUpController.off("closePopUp", handleClosePopUp);
    };
  }, []);

  // Render pop-up container only if there are pop-ups
  if (popUps.length === 0) {
    return null;
  }

  return (
    <div className="pop-up-container">
      {popUps.map((popUp) => (
        <div key={popUp.id} className="pop-up">
          {popUp.content}
        </div>
      ))}
    </div>
  );
};
