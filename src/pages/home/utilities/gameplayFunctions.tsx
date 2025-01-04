import { popUpController } from "../../../controllers/PopUpController";
import React from "react";
import { Reward } from "../../../controllers/GameController";

export const handleGameOver = ({
  winner,
  reward,
}: {
  winner: "user" | "enemy";
  reward: Reward | undefined;
}) => {
  // todo add api call to update reward and xp here
  const didUserWin = winner === "user";
  const goldWon = reward?.balance;
  popUpController.emit("showPopUp", {
    id: "gameOverPopup",
    content: (
      <div>
        <h2>{didUserWin ? "You Win!" : "You Lose!"}</h2>
        {didUserWin && goldWon && (
          <div>you won {goldWon.toLocaleString()} gold!</div>
        )}
        <button
          onClick={() =>
            popUpController.emit("closePopUp", { id: "gameOverPopup" })
          }
          style={{
            padding: "10px",
            background: "blue",
            color: "white",
            borderRadius: "5px",
            marginTop: "10px",
          }}
        >
          Close
        </button>
      </div>
    ),
  });
};
