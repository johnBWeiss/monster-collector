import React, { FC, useState } from "react";
import { PageSection } from "../../coreComponents/pageSection/PageSection";
import background from "../../assets/images/monsters/battlefield.webp";
import yogi1Back from "../../assets/images/monsters/yogi1-back.png";
import baddy1 from "../../assets/images/monsters/baddy-1.png";
import fireball from "../../assets/images/monsters/fireball.png";
import fireballSound from "../../assets/sounds/attacks/fireAttackSound.mp3";
import "./home.scss";

export type HomeProps = {};

export const Home: FC<HomeProps> = () => {
  const [fireballStyle, setFireballStyle] = useState({
    display: "none",
  });
  const audio = new Audio(fireballSound); // Create an audio instance

  // Function to trigger the fireball movement
  const shootFireball = () => {
    audio.currentTime = 0; // Ensure sound starts from the beginning
    audio.play();
    setFireballStyle({
      display: "block",
    });

    // After the animation ends, reset the fireball
    setTimeout(() => {
      setFireballStyle({
        display: "none",
      });
    }, 1200); // Match the duration of the animation
  };

  return (
    <PageSection>
      <img
        src={background}
        alt="background"
        style={{
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          position: "absolute",
        }}
      />
      <div className="height-100 width-100 flex justify-center align-end">
        <div
          style={{
            width: "190px",
            zIndex: 1,
            position: "relative",
            bottom: "100px",
          }}
        >
          <img src={baddy1} alt="yogi1-back" />
          <img
            className="fireball"
            src={fireball}
            style={{
              zIndex: 1,
              width: "40px",
              borderRadius: "50%",
              display: fireballStyle.display,
              position: "absolute",
              top: "50%",
              right: 0,
              left: 0,
              margin: "0 auto",
              // transition: "all 1s ease-in-out", // Smooth animation
            }}
          />
        </div>

        <img
          onClick={() => shootFireball()}
          src={yogi1Back}
          alt="yogi1-back"
          style={{
            width: "90px",
            zIndex: 1,
            position: "relative",
            bottom: "10px",
          }}
        />
      </div>
    </PageSection>
  );
};
