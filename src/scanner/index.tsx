import * as React from "react";
import {
  Box,
  Button,
  TextField,
  makeStyles,
  Theme,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  DialogActions,
} from "@material-ui/core";

import { NotFoundException, BrowserPDF417Reader } from "@zxing/library/esm";
import "../index.css";
import { parse } from "./parser";

const ScanApp = () => {
  const [value, setValue] = React.useState<any>();
  let selectedDeviceId: any;
  const codeReader: any = new BrowserPDF417Reader();
  const [show, setShow] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const ele = document.getElementById("scanlight");
  let res=false
  const handleScan = async () => {
    setShow(true);
    
    if (ele !== null) {
      ele.style.display = "block";
    }
    try {
      const controls=await codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        "video",
        (result: any, err: any) => {
          if (result) {
            alert(result);

            const data = parse(result.text);
            setValue(data);
            // console.log(data, codeReader);

            // console.log(JSON.stringify(data, null, 2));
            codeReader.reset();
            if (ele !== null) {
              ele.style.display = "none";
            }
            // setOpen(false);
            // setValue(" ");
            res=true;
          }
          if (err) {
            console.log("error");
            setTimeout(() => {
              // alert("couldn't detect, try again");\
              // console.log("vaalue", result, value);
              if (!res) {
                setOpen(true);
                codeReader.reset();
                if (ele !== null) {
                  ele.style.display = "none";
                }
                // setValue("error");
              }
            }, 10000);
          }
          // if (err instanceof NotFoundException) {
          //   console.log("excep");

          // }
        }
      );
      // console.log("con",controls)
      // setTimeout(() => controls.stop(), 2000);
    } catch (err) {
      // console.log("err");
    }
  };

  const handleReset = () => {
    codeReader.reset();
    // setShow(false);
    if (ele !== null) {
      ele.style.display = "none";
    }
    setValue("");
    setOpen(false);
  };


  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-around">
        <Button
          style={{ width: "100px" }}
          color="primary"
          variant="contained"
          onClick={handleScan}
        >
          scan
        </Button>

        <Button
          style={{ width: "100px" }}
          color="primary"
          variant="contained"
          onClick={handleReset}
        >
          Reset
        </Button>
      </Box>
      <Dialog open={open}>
        <DialogContent dividers>
          <Typography gutterBottom>
            Couldn't detect!! Please place the card properly.
          </Typography>
        </DialogContent>{" "}
        <DialogActions>
          <Button autoFocus onClick={handleReset} color="primary">
            Try Again
          </Button>
        </DialogActions>
      </Dialog>
      {show && (
        <>
          <div>Please align your barcode into this rectangular box</div>

          <div className="barcode-scanner">
            <video id="video" className="video" width="100%"></video>
            <div className="scanarea">
              <div
                id="scanlight"
                className="scanlight"
                style={{ display: "none" }}
              ></div>
            </div>
          </div>
        </>
      )}
      <Box display="flex" flexDirection="column" justifyContent="space-around">
        <TextField
          label="Full Name"
          style={{ height: "50px" }}
          variant="outlined"
          size="small"
          value={
            value
              ? value?.fullName !== undefined
                ? value?.fullName || ""
                : value?.firstName || ""
              : ""
          }
        />
        <TextField
          label="Date Of Birth"
          style={{ height: "50px" }}
          variant="outlined"
          size="small"
          value={value?.dateOfBirth || ""}
        />
        <TextField
          label="Address Street"
          style={{ height: "50px" }}
          variant="outlined"
          size="small"
          value={value?.addressStreet || ""}
        />
        <TextField
          label="Address City"
          style={{ height: "50px" }}
          variant="outlined"
          size="small"
          value={value?.addressCity || ""}
        />
        <TextField
          label="Date Of Expiry"
          style={{ height: "50px" }}
          variant="outlined"
          size="small"
          value={value?.dateOfExpiry || ""}
        />
      </Box>
    </Box>
  );
};

export default ScanApp;
