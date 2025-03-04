/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { Modal, Input, Button, message } from "antd";
import { QrcodeOutlined } from "@ant-design/icons";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";

export default function Bracode({ isOpen, onClose, onScanSuccess }) {
  const [manualSerial, setManualSerial] = useState("");
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  const startScanning = async () => {
    setError(null);
    try {
      console.log("[Html5Qrcode] Requesting camera access...");
      const devices = await Html5Qrcode.getCameras();
      if (!devices || devices.length === 0) {
        throw new Error("No cameras found on this device.");
      }

      const cameraId =
        devices.find((device) => device.facingMode === "environment")?.id ||
        devices[0].id;

      html5QrCodeRef.current = new Html5Qrcode(scannerRef.current.id);

      const config = {
        fps: 20,
        qrbox: { width: 350, height: 200 },
        aspectRatio: 1.75,
        formatsToSupport: ["CODE_128"],
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true,
        },
        disableFlip: false,
      };

      await html5QrCodeRef.current.start(
        cameraId,
        config,
        (decodedText, decodedResult) => {
          console.log("[Html5Qrcode] Detected barcode:", {
            decodedText,
            confidence: decodedResult?.confidence || "N/A",
            format: decodedResult?.format || "N/A",
            rawBytes: decodedResult?.rawBytes || "N/A",
          });

          const isValidFormat =
            /^PRD-\d+-\d{4}$/.test(decodedText) && decodedText.length > 10;
          if (isValidFormat) {
            console.log(
              "[Html5Qrcode] Valid barcode detected, proceeding with assignment"
            );
            stopScanning();
            onScanSuccess(decodedText);
            onClose();
          } else {
            setError(
              "Invalid barcode format. Expected: PRD-<timestamp>-<random>"
            );
            console.warn("[Html5Qrcode] Invalid format detected:", decodedText);
          }
        },
        (errorMessage) => {
          console.log("[Html5Qrcode] Scan error:", {
            message: errorMessage,
            timestamp: new Date().toISOString(),
          });
        }
      );
      console.log(
        "[Html5Qrcode] Scanner started successfully with config:",
        config
      );
    } catch (err) {
      console.error("[Html5Qrcode] Error starting scanner:", {
        message: err.message,
        stack: err.stack,
      });
      setError(
        `Camera error: ${err.message || "Permission denied or no camera"}`
      );
      stopScanning();
    }
  };

  const stopScanning = () => {
    if (
      html5QrCodeRef.current &&
      html5QrCodeRef.current.getState() === Html5QrcodeScannerState.SCANNING
    ) {
      html5QrCodeRef.current
        .stop()
        .then(() => {
          console.log("[Html5Qrcode] Scanner stopped");
          html5QrCodeRef.current = null;
        })
        .catch((err) =>
          console.error("[Html5Qrcode] Error stopping scanner:", err)
        );
    }
  };

  useEffect(() => {
    if (isOpen) {
      console.log("[Html5Qrcode] Starting scanner...");
      scannerRef.current.id = "html5-qrcode-scanner";
      startScanning();
    } else {
      stopScanning();
    }

    return () => {
      console.log("[Html5Qrcode] Cleanup triggered");
      stopScanning();
    };
  }, [isOpen]);

  const handleManualSubmit = () => {
    if (manualSerial.trim()) {
      console.log("[Html5Qrcode] Manual entry submitted:", manualSerial.trim());
      onScanSuccess(manualSerial.trim());
      setManualSerial("");
      onClose();
    } else {
      message.error("Please enter a valid code (e.g., PRD-1740558574201-4971)");
    }
  };

  return (
    <Modal
      title="Scan Barcode"
      open={isOpen}
      onCancel={() => {
        stopScanning();
        setManualSerial("");
        setError(null);
        onClose();
      }}
      footer={null}
      centered
      width={600}
    >
      <div
        ref={scannerRef}
        className="relative w-full h-64"
        style={{ overflow: "hidden", backgroundColor: "black" }}
      />
      {error && <div className="mt-4 text-center text-red-600">{error}</div>}
      <div className="mt-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <Input
            value={manualSerial}
            onChange={(e) => setManualSerial(e.target.value)}
            placeholder="Enter code manually (e.g., PRD-1740558574201-4971)"
            prefix={<QrcodeOutlined />}
            onPressEnter={handleManualSubmit}
          />
          <Button
            type="primary"
            onClick={handleManualSubmit}
            disabled={!manualSerial.trim()}
          >
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
}
