import React, { useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TransitionLeft(props) {
  return <Slide {...props} direction="down" />;
}

function Toast(props) {
  const { msg, showStatus, severity, onClose } = props;
  const [open, setOpen] = React.useState(showStatus || true);

  useEffect(() => {
    if (showStatus) setOpen(showStatus);
  }, [showStatus]);

  const handleClose = (event, reason) => {
    setOpen(false);
    if (onClose) onClose();
  };

  return (
    <>
      <Snackbar open={open} anchorOrigin={{ vertical: "top", horizontal: "right" }} autoHideDuration={3000} TransitionComponent={TransitionLeft} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {msg}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Toast;
