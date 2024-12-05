'use client'

import { useState } from 'react'
import { Button } from "@/common/components/ui/button"
import { Input } from "@/common/components/ui/input"
import { Label } from "@/common/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/common/components/ui/card"
import { useRouter } from 'next/router'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const router = useRouter();

  // Handle signup form submission
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Signup:', { email, password, walletAddress })
    router.push({
        pathname: '/auth/profile',
        query: { email, password, walletAddress },
    })
    alert('Redirecting to profile completion...')
  }

  // Connect to MetaMask wallet and retrieve wallet address
  const connectMetamask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account connection
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        
        if (accounts.length > 0) {
          const connectedAddress = accounts[0]
          setWalletAddress(connectedAddress)
        } else {
          alert("No accounts found. Please check your MetaMask.")
        }
      } catch (error) {
        console.error("Error connecting to MetaMask:", error)
        alert("Failed to connect to MetaMask.")
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask.")
    }
  }

  const goToLogin = () => {
    router.push('/auth/login');
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-yellow-50">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover mix-blend-overlay opacity-50"
        style={{ pointerEvents: 'none' }}
      >
        <source src="/placeholder.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <Card className="w-[400px] z-10 shadow-2xl bg-white">
        <CardHeader className="space-y-1 bg-yellow-400 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-center">Sign Up</CardTitle>
          <CardDescription className="text-center text-yellow-100">Create an account to get started</CardDescription>
        </CardHeader>
        <CardContent className="mt-4">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-yellow-800">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-yellow-800">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-yellow-800">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="walletAddress" className="text-sm font-medium text-yellow-800">Wallet Address</Label>
              <Input
                id="walletAddress"
                type="text"
                placeholder="Connect Metamask to populate"
                value={walletAddress}
                readOnly
                className="w-full px-3 py-2 border border-yellow-300 rounded-md bg-yellow-50"
              />
            </div>
            <Button type="button" onClick={connectMetamask} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
              Connect Metamask
            </Button>
            <Button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-white">
              Sign Up
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-yellow-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-yellow-600">Already have an account</span>
              </div>
            </div>
            <Button type="button" onClick={goToLogin} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
              Signin
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
