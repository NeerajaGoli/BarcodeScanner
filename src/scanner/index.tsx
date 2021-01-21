import * as React from "react";
import { Box, Button, TextField, makeStyles, Theme } from "@material-ui/core";

import { NotFoundException, BrowserPDF417Reader } from "@zxing/library/esm";
import "../index.css";
import { parse } from "./parser";

const ScanApp = () => {
  const [value, setValue] = React.useState<any>();
  let selectedDeviceId: any;
  const codeReader: any = new BrowserPDF417Reader();

  const handleScan = () => {
    const ele = document.getElementById("dbrScanner-scanlight");
    if (ele !== null) {
      ele.style.display = "block";
    }
    try {
      codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        "video",
        (result: any, err: any) => {
          if (result) {
            alert(result);

            const data = parse(result.text);
            setValue(data);
            // console.log(JSON.stringify(data, null, 2));
            // codeReader.reset();
            if (ele !== null) {
              ele.style.display = "none";
            }
            // setValue(" ");
          }
          if (err && !(err instanceof NotFoundException)) {
            // console.log("error");
            setValue("error");
          }
        }
      );
    } catch (err) {
      // console.log("err");
    }
  };

  const handleReset = () => {
    codeReader.reset();
    setValue(" ");
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

      <div>Please align your barcode into this rectangular box</div>

      <div className="barcode-scanner">
        <video id="video" className="video"></video>
        <div className="scanarea">
          <div
            id="scanlight"
            className="scanlight"
            style={{ display: "none" }}
          ></div>
        </div>
      </div>
      <Box display="flex" flexDirection="column" justifyContent="space-around">
        <TextField
          label="Full Name"
          InputLabelProps={{
            shrink: value ? true : false,
          }}
          value={
            value
              ? value?.fullName !== undefined
                ? value?.fullName
                : value?.firstName
              : value
          }
        />
        <TextField
          label="Date Of Birth"
          InputLabelProps={{
            shrink: value ? true : false,
          }}
          value={value?.dateOfBirth}
        />
        <TextField
          label="Address Street"
          InputLabelProps={{
            shrink: value ? true : false,
          }}
          value={value?.addressStreet}
        />
        <TextField
          label="Address City"
          InputLabelProps={{
            shrink: value ? true : false,
          }}
          value={value?.addressCity}
        />
        <TextField
          label="Date Of Expiry"
          InputLabelProps={{
            shrink: value ? true : false,
          }}
          value={value?.dateOfExpiry}
        />
      </Box>
    </Box>
  );
};

export default ScanApp;
