/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { Button, Modal, Input, message } from "antd";
import Scanner from "react-qr-barcode-scanner";

export default function QRScanner() {
  const [data, setData] = useState(null);
  const [serialNumber, setSerialNumber] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleError = (error) => {
    console.error("Scan Error:", error);
    message.error("Failed to scan. Please try again.");
  };

  const handleScan = (result) => {
    if (result?.text) {
      setData(result.text);
      console.log("Scanned Data:", result.text);
      message.success(`Scanned: ${result.text}`);
    }
  };

  const handleSerialSubmit = () => {
    console.log("Serial Number submitted:", serialNumber);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
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

      {data && (
        <div className="mt-4 p-4 bg-blue-600 mx-4 rounded-lg text-center">
          <p>Scanned Code: {data}</p>
        </div>
      )}

      {/* Manual Serial Number Entry */}
      <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-md w-full">
        <div className="bg-white p-4 text-center">
          <p className="text-gray-700 mb-2">Didn't find QR code?</p>
          <p className="text-black">
            Please enter the
            <span
              className="text-black font-bold cursor-pointer underline ml-1"
              onClick={() => setIsModalOpen(true)}
            >
              Serial Number Manually
            </span>
          </p>
        </div>
      </div>

      {/* Modal for Manual Serial Number Entry */}
      <div className="">
        <Modal
          title="Enter Serial Number Manually Here"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          centered
          className="bg-gray-800   text-white "
        >
          <div className="space-y-4 ">
            <Input
              id="serial"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="bg-gray-700 border-gray-600  text-white"
              placeholder="Enter serial number"
            />
            <Button
              type="primary"
              className="w-full bg-blue-600"
              onClick={handleSerialSubmit}
            >
              Submit
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
