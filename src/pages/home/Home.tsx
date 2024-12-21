import React, { FC, useRef, useState } from "react";
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
  const [shooterStyle, setShooterStyle] = useState({
    transform: "translate(0, 0)",
    transition: "transform 0.3s ease-out",
  });
  const audioRef = useRef(new Audio(fireballSound));

  const shootFireball = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.play();

    setFireballStyle({
      display: "block",
    });

    setShooterStyle({
      transform: "translate(-20px, -20px) rotate(-15deg)",
      transition: "transform 0.3s ease-out",
    });

    setTimeout(() => {
      setShooterStyle({
        transform: "translate(0, 0) rotate(0deg)",
        transition: "transform 0.3s ease-out",
      });
    }, 300);

    setTimeout(() => {
      setFireballStyle({
        display: "none",
      });
    }, 1000);
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
        >
          <img src={baddy1} alt="yogi1-back" />
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
            onClick={shootFireball}
            src={yogi1Back}
            alt="yogi1-back"
            style={{
              width: "90px",
              zIndex: 1,
              position: "relative",
              bottom: "50px",
              cursor: "pointer",
              ...shooterStyle,
            }}
          />
        </div>
      </div>
    </PageSection>
  );
};
