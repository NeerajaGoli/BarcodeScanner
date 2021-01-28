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
import * as ScanditSDK from "scandit-sdk";
import { BarcodePicker, Barcode, ScanSettings } from "scandit-sdk";

const ScanApp = () => {
  const [value, setValue] = React.useState<any>();
  let selectedDeviceId: any;
  const codeReader: any = new BrowserPDF417Reader();
  const [show, setShow] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [bcodePicker, setPicker] = React.useState();
  const ele = document.getElementById("scanlight");
  let res = false;
  const handleScan = async () => {
    setShow(true);

    if (ele !== null) {
      ele.style.display = "block";
    }
    try {
      await codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        "video",
        (result: any, err: any) => {
          if (result) {
            alert(result);

            const data = parse(result.text);
            setValue(data);

            codeReader.reset();
            if (ele !== null) {
              ele.style.display = "none";
            }

            res = true;
          }
          if (err) {
            console.log("error");
            setTimeout(() => {
              if (!res) {
                setOpen(true);
                codeReader.reset();
                if (ele !== null) {
                  ele.style.display = "none";
                }
              }
            }, 10000);
          }
        }
      );
    } catch (err) {
      console.log("error");
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
    if (bcodePicker) {
      bcodePicker.destroy();
    }
  };

  const handle = async () => {
    await ScanditSDK.configure(
      "LICENSE_KEY",
      {
        engineLocation: "https://cdn.jsdelivr.net/npm/scandit-sdk@5.x/build/",
      }
    )
      .then(() => {
        const ele = document.getElementById("scandit-barcode-picker");

        if (ele !== null) {
          BarcodePicker.create(ele, {
            playSoundOnScan: true,
            vibrateOnScan: true,
          })
            .then((barcodePicker: any) => {
              const scanSettings = new ScanSettings({
                enabledSymbologies: [
                  Barcode.Symbology.PDF417,
                  Barcode.Symbology.MICRO_PDF417,
                ],
                codeDuplicateFilter: 1000,
              });

              barcodePicker.applyScanSettings(scanSettings);
              setPicker(barcodePicker);
              barcodePicker.on("scan", (scanResult: any) => {
                const d = scanResult.barcodes.reduce(
                  (string: any, barcode: any) => {
                    return (
                      string +
                      `${Barcode.Symbology.toHumanizedName(
                        barcode.symbology
                      )}: ${barcode.data}\n`
                    );
                  },
                  ""
                );
                alert(d);
                const data = parse(d);
                setValue(data);
              });
            })
            .catch((e) => {
              console.log("err", e);
            });
        }
      })
      .catch((e: any) => {
        alert("err");
      });
  };
  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-around">
        {/* <Button
          style={{ width: "200px" }}
          color="primary"
          variant="contained"
          onClick={handleScan}
        >
          Zxing Scan
        </Button> */}

        <Button
          style={{ width: "100px" }}
          color="primary"
          variant="contained"
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button
          style={{ width: "200px" }}
          color="primary"
          variant="contained"
          onClick={handle}
        >
          Scandit Scan
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
      <div id="scandit-barcode-picker"></div>

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
