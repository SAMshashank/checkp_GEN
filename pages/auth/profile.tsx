"use client";

import { useState } from "react";

import { useRouter } from "next/router";

import { Button } from "@/common/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/common/components/ui/card";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/common/components/ui/radio-group";
import { Textarea } from "@/common/components/ui/textarea";

export default function ProfileCompletion() {
  const [gender, setGender] = useState("");
  const [avatar, setAvatar] = useState("");
  const [description, setDescription] = useState("");
  const [nickname, setNickname] = useState("");
  const router = useRouter();
  const { email, password, walletAddress } = router.query;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile completion logic here
    console.log("Profile completed:", {
      gender,
      avatar,
      description,
      nickname,
    });
    // Redirect to main page
    alert("Profile completed! Redirecting to main page...");
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST", // Specify POST method
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify({
          email,
          name: nickname,
          avatar,
          gender,
          description,
          walletAddress,
          password,
        }), // Convert data to JSON string
      });

      const result = await response.json();
      router.push("/");
      console.log(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const avatars = [
    "/placeholder.svg?height=50&width=50",
    "/placeholder.svg?height=50&width=50",
    "/placeholder.svg?height=50&width=50",
    "/placeholder.svg?height=50&width=50",
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-yellow-50 p-4">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="space-y-1 rounded-t-lg bg-yellow-400 text-white">
          <CardTitle className="text-center text-2xl font-bold">
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-center text-yellow-100">
            Tell us more about yourself
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-lg font-semibold text-yellow-800">
                Gender
              </Label>
              <RadioGroup
                value={gender}
                onValueChange={setGender}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="male"
                    id="male"
                    className="border-yellow-400 text-yellow-400"
                  />
                  <Label
                    htmlFor="male"
                    className="cursor-pointer text-yellow-800"
                  >
                    Male
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="female"
                    id="female"
                    className="border-yellow-400 text-yellow-400"
                  />
                  <Label
                    htmlFor="female"
                    className="cursor-pointer text-yellow-800"
                  >
                    Female
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="other"
                    id="other"
                    className="border-yellow-400 text-yellow-400"
                  />
                  <Label
                    htmlFor="other"
                    className="cursor-pointer text-yellow-800"
                  >
                    Other
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label className="text-lg font-semibold text-yellow-800">
                Select Avatar
              </Label>
              <div className="flex justify-center space-x-4">
                {avatars.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Avatar ${index + 1}`}
                    className={`h-16 w-16 cursor-pointer rounded-full transition-all duration-200 ${
                      avatar === src
                        ? "scale-110 ring-4 ring-yellow-400"
                        : "hover:scale-105"
                    }`}
                    onClick={() => setAvatar(src)}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="nickname"
                className="text-lg font-semibold text-yellow-800"
              >
                Nickname
              </Label>
              <Input
                id="nickname"
                placeholder="Enter your nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                className="w-full rounded-md border border-yellow-300 px-3 py-2 focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-lg font-semibold text-yellow-800"
              >
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Tell us about yourself"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="min-h-[100px] w-full rounded-md border border-yellow-300 px-3 py-2 focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-md bg-yellow-400 py-2 text-white transition-colors duration-200 hover:bg-yellow-500"
            >
              Complete Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
