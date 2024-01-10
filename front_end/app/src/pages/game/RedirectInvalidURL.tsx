import React from "react";

import Backdrop from "@mui/material/Backdrop";

import { useNavigate } from "react-router-dom";

function RedirectInvalidURL() {
  const [countdownTimer, setCountdownTimer] = React.useState(5);
  const navigate = useNavigate();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCountdownTimer(countdownTimer - 1);
    }, 1000);
    if (countdownTimer === 0) {
      navigate("/");
    }
    return () => clearTimeout(timer);
  }, [countdownTimer, navigate]);

  return (
    <Backdrop open={true}>
      <h2>Invalid URL, redirecting to home page in {countdownTimer} seconds</h2>
    </Backdrop>
  );
}

export default RedirectInvalidURL;
