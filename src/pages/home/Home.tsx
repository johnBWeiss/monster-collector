import React, { FC, useState } from "react";
import { PageSection } from "../../coreComponents/pageSection/PageSection";
import background from "../../assets/images/monsters/battlefield.webp";
import yogi1Back from "../../assets/images/monsters/yogi1-back.png";
import baddy1 from "../../assets/images/monsters/baddy-1.png";
import fireball from "../../assets/images/monsters/fireball.png";

export type HomeProps = {};

export const Home: FC<HomeProps> = () => {
  const [fireballStyle, setFireballStyle] = useState({
    bottom: "10px", // Adjust based on starting position
    opacity: 0,
    right: "0px",
  });

  // Function to trigger the fireball movement
  const shootFireball = () => {
    setFireballStyle({
      right: "30px", // End near baddy-1
      bottom: "100px",
      opacity: 1, // Make it visible
    });

    // After the animation ends, reset the fireball
    setTimeout(() => {
      setFireballStyle({
        bottom: "10px", // Adjust based on starting position
        opacity: 0,
        right: "0px",
      });
    }, 1000); // Match the duration of the animation
  };
  return (
    <PageSection>
      <img
        src={background}
        alt="background"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
        }}
      />
      <div className="height-100 width-100 flex justify-center align-end">
        <img
          src={baddy1}
          alt="yogi1-back"
          style={{
            width: "190px",
            zIndex: 1,
            position: "relative",
            bottom: "100px",
          }}
        />
        <img
          className="fireball"
          src={fireball}
          style={{
            zIndex: 1,
            width: "40px",
            borderRadius: "50%",
            transition: "all 1s ease-in-out", // Smooth animation
            transform: `translate(${fireballStyle.right})`,
            opacity: fireballStyle.opacity,
          }}
        />

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
