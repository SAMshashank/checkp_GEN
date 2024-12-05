import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/common/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/common/components/ui/card";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login:", { email, password, walletAddress });
    // Redirect to the main page after successful login
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST", // Specify POST method
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();
      localStorage.setItem("token", result.authtoken);
      router.push("/");
      console.log(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const connectMetamask = async () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== "undefined") {
      try {
        // Request access to the user's wallet
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        // Set the wallet address once connected
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      alert("Please install MetaMask to connect your wallet.");
    }
  };

  const goToSignUp = () => {
    router.push("/auth/signUp");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-yellow-50">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute h-full w-full object-cover opacity-50 mix-blend-overlay"
        style={{ pointerEvents: "none" }}
      >
        <source src="/placeholder.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <Card className="z-10 w-[400px] bg-white shadow-2xl">
        <CardHeader className="space-y-1 rounded-t-lg bg-yellow-400 text-white">
          <CardTitle className="text-center text-3xl font-bold">Login</CardTitle>
          <CardDescription className="text-center text-yellow-100">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-yellow-800">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-yellow-300 px-3 py-2 focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-yellow-800">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-md border border-yellow-300 px-3 py-2 focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-yellow-400 text-white hover:bg-yellow-500"
            >
              Login
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-yellow-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-yellow-600">Or</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="walletAddress" className="text-sm font-medium text-yellow-800">
                Wallet Address
              </Label>
              <Input
                id="walletAddress"
                type="text"
                placeholder="Connect Metamask to login"
                value={walletAddress}
                readOnly
                className="w-full rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2"
              />
            </div>
            <Button
              type="button"
              onClick={connectMetamask}
              className="w-full bg-yellow-500 text-white hover:bg-yellow-600"
            >
              Connect Metamask to Login
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-yellow-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-yellow-600">
                  Don't have an account?
                </span>
              </div>
            </div>
            <Button
              type="button"
              onClick={goToSignUp}
              className="w-full bg-yellow-500 text-white hover:bg-yellow-600"
            >
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
