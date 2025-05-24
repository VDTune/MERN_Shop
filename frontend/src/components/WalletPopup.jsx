import React, { useState, useEffect } from "react";
import MetaMaskOnboarding from "@metamask/onboarding";

const WalletPopup = ({ setShowWallet }) => {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (MetaMaskOnboarding.isMetaMaskInstalled()) {
        setIsMetaMaskInstalled(true);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInstall = () => {
    const onboarding = new MetaMaskOnboarding();
    onboarding.startOnboarding();
    setIsLoading(true);
  };

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        setIsLoading(false);

        // Thử mở giao diện ví MetaMask
        try {
          await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [{ eth_accounts: {} }],
          });
        } catch (e) {
          console.warn("MetaMask permissions request rejected or not supported");
        }
      }
    } catch (error) {
      console.error("User rejected connection", error);
      setIsLoading(false);
    }
  };

  // Hàm xử lý login (lưu token và đóng popup)
  const handleLogin = () => {
    localStorage.setItem("token", account); // Lưu address làm token/username
    setShowWallet(false);
    // Nếu cần, bạn có thể gọi thêm hàm setToken từ props/context ở đây
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
        {!isMetaMaskInstalled ? (
          <>
            <h2 className="text-xl font-semibold mb-2 text-center">
              MetaMask Not Installed
            </h2>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Please install MetaMask to use wallet features.
            </p>
            {isLoading && (
              <div className="flex justify-center mb-3">
                <svg
                  className="animate-spin h-6 w-6 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              </div>
            )}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowWallet(false)}
                className="px-4 py-2 text-sm rounded bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleInstall}
                className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Install MetaMask
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">
              {isConnected ? "Wallet Connected" : "Connect Your Wallet"}
            </h2>

            {isConnected && account && (
              <>
                <div className="text-sm text-green-600 text-center mb-3 transition-opacity animate-fade-in">
                  ✅ Connected successfully:
                  <br />
                  <span className="font-mono break-all">{account}</span>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={handleLogin}
                    className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Login & Start Shopping
                  </button>
                </div>
              </>
            )}

            {isLoading && !isConnected && (
              <div className="text-sm text-blue-500 text-center mb-3 animate-pulse">
                Waiting for wallet connection...
              </div>
            )}

            {!isConnected && (
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowWallet(false)}
                  className="px-4 py-2 text-sm rounded bg-gray-300 hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={connectWallet}
                  className="px-4 py-2 text-sm rounded bg-green-600 text-white hover:bg-green-700 transition"
                  disabled={isLoading}
                >
                  Connect Wallet
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WalletPopup;
