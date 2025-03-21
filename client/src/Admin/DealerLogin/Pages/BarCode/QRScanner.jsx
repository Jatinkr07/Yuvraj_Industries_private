/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { Modal, Input, Button, message } from "antd";
import { QrcodeOutlined } from "@ant-design/icons";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";

export default function QRScanner({ isOpen, onClose, onScanSuccess }) {
  const [manualSerial, setManualSerial] = useState("");
  const [error, setError] = useState(null);
  const [cameraId, setCameraId] = useState(null);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const lastTapRef = useRef(0);

  const startScanning = async (selectedCameraId) => {
    setError(null);
    try {
      console.log("[Html5Qrcode] Requesting camera access...");
      const devices = await Html5Qrcode.getCameras();
      if (!devices || devices.length === 0) {
        throw new Error("No cameras found on this device.");
      }

      const rearCamera = devices.find(
        (device) => device.facingMode === "environment"
      );
      const frontCamera = devices.find(
        (device) => device.facingMode === "user"
      );

      const initialCameraId =
        selectedCameraId || rearCamera?.id || devices[0].id;

      setCameraId(initialCameraId);
      setIsFrontCamera(frontCamera?.id === initialCameraId);

      html5QrCodeRef.current = new Html5Qrcode(scannerRef.current.id);

      const config = {
        fps: 20,
        qrbox: { width: 350, height: 200 },
        aspectRatio: 1.75,
        formatsToSupport: ["CODE_128", "QR_CODE"],
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true,
        },
        disableFlip: false,
      };

      await html5QrCodeRef.current.start(
        initialCameraId,
        config,
        (decodedText, decodedResult) => {
          console.log("[Html5Qrcode] Detected code:", {
            decodedText,
            type: decodedResult.format?.format || "Unknown",
            confidence: decodedResult?.confidence || "N/A",
          });

          // Validate barcode format if it's CODE_128
          if (decodedResult.format?.format === "CODE_128") {
            const isValidFormat =
              /^PRD-\d+-\d{4}$/.test(decodedText) && decodedText.length > 10;
            if (!isValidFormat) {
              setError(
                "Invalid barcode format. Expected: PRD-<timestamp>-<random>"
              );
              console.warn(
                "[Html5Qrcode] Invalid barcode format:",
                decodedText
              );
              return;
            }
          }

          stopScanning();
          onScanSuccess(decodedText);
          onClose();
        },
        (errorMessage) => {
          console.log("[Html5Qrcode] Scan error:", {
            message: errorMessage,
            timestamp: new Date().toISOString(),
          });
        }
      );
      console.log("[Html5Qrcode] Scanner started with config:", config);
    } catch (err) {
      console.error("[Html5Qrcode] Error starting scanner:", err);
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

  const handleDoubleTap = async () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300; // milliseconds

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      stopScanning();
      const devices = await Html5Qrcode.getCameras();
      const rearCamera = devices.find(
        (device) => device.facingMode === "environment"
      );
      const frontCamera = devices.find(
        (device) => device.facingMode === "user"
      );

      const newCameraId = isFrontCamera ? rearCamera?.id : frontCamera?.id;
      if (newCameraId) {
        setIsFrontCamera(!isFrontCamera);
        await startScanning(newCameraId);
      }
    }
    lastTapRef.current = now;
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
      message.error("Please enter a valid code");
    }
  };

  return (
    <Modal
      title={`Scan Barcode/QR (${isFrontCamera ? "Front" : "Rear"} Camera)`}
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
        onClick={handleDoubleTap}
        className="relative w-full h-64 cursor-pointer"
        style={{ overflow: "hidden", backgroundColor: "black" }}
      >
        <div className="absolute top-2 left-2 text-white bg-black/50 px-2 py-1 rounded">
          Double-tap to switch camera
        </div>
      </div>
      {error && <div className="mt-4 text-center text-red-600">{error}</div>}
      <div className="mt-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <Input
            value={manualSerial}
            onChange={(e) => setManualSerial(e.target.value)}
            placeholder="Enter code manually"
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
