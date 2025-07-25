import { useState, useEffect, useMemo } from "react";
import { Snackbar, Alert } from "@mui/material";
import { CSSProperties } from "react";

const DetectOffline = ({ showOverlay = false, showToast = true }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setOpen(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setOpen(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const alertMessage = useMemo(
    () => (isOnline ? "Back Online" : "You are offline"),
    [isOnline]
  );

  return (
    <>
      {showOverlay && !isOnline && (
        <div style={overlayStyle}>
          <h1>You are offline</h1>
        </div>
      )}
      {showToast && (
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={() => setOpen(false)}
        >
          <Alert
            onClose={() => setOpen(false)}
            severity={isOnline ? "success" : "error"}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

const overlayStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

export default DetectOffline;
