import React, { FC, useRef, useState } from "react";
import { PageSection } from "../../coreComponents/pageSection/PageSection";
import background from "../../assets/images/monsters/battlefield.webp";
import yogi1Back from "../../assets/images/monsters/yogi1-back.png";
import baddy1 from "../../assets/images/monsters/baddy-1.png";
import fireball from "../../assets/images/monsters/fireball.png";
import fireballSound from "../../assets/sounds/attacks/fireAttackSound.mp3";
import "./home.scss";

export type HomeProps = {};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const Home: FC<HomeProps> = () => {
  const [fireballStyle, setFireballStyle] = useState({
    display: "none",
  });
  const [shooterStyle, setShooterStyle] = useState({
    transform: "translate(0, 0)",
    transition: "transform 0.3s ease-out",
  });
  const [isShaking, setIsShaking] = useState(false);
  const audioRef = useRef(new Audio(fireballSound));

  const shootFireball = (): Promise<void> => {
    return new Promise(async (resolve) => {
      // Play sound
      audioRef.current.currentTime = 0;
      audioRef.current.play();

      // Start fireball animation
      setFireballStyle({ display: "block" });
      // Shooter animation
      setShooterStyle({
        transform: "translate(-20px, -20px) rotate(-15deg)",
        transition: "transform 0.3s ease-out",
      });

      await delay(300); // Shooter animation duration
      setShooterStyle({
        transform: "translate(0, 0) rotate(0deg)",
        transition: "transform 0.3s ease-out",
      });
      // Wait for fireball to reach the enemy
      await delay(700);
      // Hide the fireball
      setFireballStyle({ display: "none" });
      // Trigger enemy shaking
      setIsShaking(true);
      await delay(500); // Shake duration
      setIsShaking(false);

      // Resolve the promise to indicate the shooting sequence is complete
      resolve();
    });
  };

  const handleUserShoot = async () => {
    console.log("Shooting started...");
    await shootFireball();
    console.log("Shooting completed!");
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
            bottom: "150px",
            right: "50px",
          }}
          className={isShaking ? "hit-recoil-left" : ""}
        >
          <img src={baddy1} alt="enemy" />
        </div>

        <div style={{ position: "relative" }}>
          <img
            className="fireball"
            src={fireball}
            style={{
              zIndex: 1,
              width: "40px",
              borderRadius: "50%",
              display: fireballStyle.display,
              position: "absolute",
              right: "20px", // Start near the shooter
              bottom: "60px", // Align with shooter's height
            }}
          />
          <img
            onClick={handleUserShoot}
            src={yogi1Back}
            alt="yogi1-back"
            style={{
              width: "90px",
              zIndex: 1,
              position: "relative",
              bottom: "50px",
              cursor: "pointer",
              ...shooterStyle, // Apply shooter animation styles
            }}
          />
        </div>
      </div>
    </PageSection>
  );
};
