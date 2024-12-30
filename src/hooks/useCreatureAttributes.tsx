import { useEffect, useState } from "react";
import { CreatureController } from "../Controllers/CreatureController";

export const useCreatureAttributes = (creature: CreatureController) => {
  const [attributes, setAttributes] = useState(creature.getState());

  useEffect(() => {
    const handleAttributeChange = (updatedAttributes: any) => {
      setAttributes(updatedAttributes);
    };

    // Subscribe to the "attributeChange" event
    creature.on("attributeChange", handleAttributeChange);

    // Cleanup on unmount
    return () => {
      creature.off("attributeChange", handleAttributeChange);
    };
  }, [creature]);

  return attributes;
};
