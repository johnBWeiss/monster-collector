import { useCallback, useState } from "react";
import { popUpController } from "../controllers/PopUpController";

type PopUpOptions = {
  content: React.ReactNode;
  onClose?: () => void; // Optional function called when pop-up closes
};

export const usePopUp = () => {
  const [popUpId, setPopUpId] = useState<string | null>(null);

  const showPopUp = useCallback(({ content, onClose }: PopUpOptions) => {
    const id = Date.now().toString(); // Unique ID
    setPopUpId(id);

    // Emit showPopUp event with content
    popUpController.emit("showPopUp", {
      id,
      content: (
        <div>
          {content}
          <button
            style={{
              padding: "10px",
              marginTop: "10px",
              background: "red",
              color: "white",
              borderRadius: "5px",
            }}
            onClick={() => {
              // Close the pop-up
              popUpController.emit("closePopUp", { id });

              // Call the onClose handler if provided
              if (onClose) {
                onClose();
              }
            }}
          >
            Close
          </button>
        </div>
      ),
    });
  }, []);

  const closePopUp = useCallback(() => {
    if (popUpId) {
      popUpController.emit("closePopUp", { id: popUpId });
      setPopUpId(null);
    }
  }, [popUpId]);

  return { showPopUp, closePopUp };
};
