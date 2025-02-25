/* eslint-disable react/prop-types */
// QRScanner.jsx
import { useState } from "react";
import { Button, Modal, Input, message } from "antd";
import Scanner from "react-qr-barcode-scanner";

export default function QRScanner({ isOpen, onClose, onScanSuccess }) {
  const [data, setData] = useState(null);
  const [manualSerial, setManualSerial] = useState("");
  const [isScanning, setIsScanning] = useState(true);

  const handleError = (error) => {
    console.error("Scan Error:", error);
    message.error("Failed to scan QR code. Enter manually below.");
    setIsScanning(false);
  };

  const handleScan = async (result) => {
    if (result?.text) {
      const scannedCode = result.text.trim();
      console.log("Scanned QR code:", scannedCode);
      setData(scannedCode);
      message.success(`Scanned: ${scannedCode}`);
      await onScanSuccess(scannedCode);
      onClose();
    }
  };

  const handleManualSubmit = async () => {
    if (manualSerial.trim()) {
      const manualCode = manualSerial.trim();
      console.log("Manual entry code:", manualCode);
      setData(manualCode);
      message.success(`Manual entry: ${manualCode}`);
      await onScanSuccess(manualCode);
      onClose();
    } else {
      message.error("Please enter a valid serial number or barcode");
    }
  };

  const resetState = () => {
    setData(null);
    setManualSerial("");
    setIsScanning(true);
  };

  return (
    <Modal
      title="Scan Product QR Code"
      open={isOpen}
      onCancel={() => {
        resetState();
        onClose();
      }}
      footer={null}
      centered
      className="bg-gray-900 text-white"
    >
      {isScanning && (
        <div className="relative max-w-md mx-auto mt-8 aspect-square">
          <div className="absolute inset-0 mt-12">
            <Scanner
              onError={handleError}
              onScan={handleScan}
              constraints={{
                video: {
                  facingMode: { ideal: "environment" },
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
                },
              }}
              className="w-full h-full"
            />
          </div>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-blue-500" />
            <div className="absolute top-0 right-0 w-16 h-16 border-r-4 border-t-4 border-blue-500" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-l-4 border-b-4 border-blue-500" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 border-blue-500" />
          </div>
        </div>
      )}

      {data && (
        <div className="mt-4 p-4 bg-blue-600 mx-4 rounded-lg text-center">
          <p>Processed Code: {data}</p>
        </div>
      )}

      <div className="mt-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <Input
            value={manualSerial}
            onChange={(e) => setManualSerial(e.target.value)}
            placeholder="Enter serial number or barcode manually"
            className="bg-gray-700 border-gray-600 text-white max-w-xs"
          />
          <Button
            type="primary"
            className="bg-blue-600"
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
