import { EventEmitter } from "../coreClasses/EventEmitter";
import React from "react";

type PopUpEvent = {
  id: string;
  content: React.ReactNode; // Allows dynamic JSX content
};

export class PopUpController extends EventEmitter<{
  showPopUp: PopUpEvent;
  closePopUp: { id: string };
}> {}

export const popUpController = new PopUpController();
