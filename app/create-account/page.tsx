"use client";

import { useState } from "react";
import React from "react";

//TO DO:Link button to send data to database and create account.
//Verify account is created and in database
//TO DO: Add validation for email and password fields.
//TO DO: Add error handling for failed account creation.
//TO DO: Add success message for successful account creation.
export default function CreateAccountPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("client"); // Default to "client"

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  console.log("Button clicked");
  try {
    const response = await fetch("/api/create-account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        accountType,
      }),
    });

    const data = await response.json();

    console.log(data.message);
  
  } catch (error) {
    console.error("Failed to create account:", error);
  }
  
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      
    <div className="flex gap-6">
        <label className="flex items-center gap-2">
            <input
                type="radio"
                name="accountType"
                value="client"
                checked={accountType === "client"}
                onChange={(e) => setAccountType(e.target.value)}
            />
            Client
        </label>

        <label className="flex items-center gap-2">
            <input
            type="radio"
            name="accountType"
            value="trainer"
            checked={accountType === "trainer"}
            onChange={(e) => setAccountType(e.target.value)}
            />
            Trainer
        </label>
    </div>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2"
      />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2"
        />

      <button
        type="submit"
        onClick={() => alert("Button works")}
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        Create Account
      </button>
    </form>
  );
}

/* 

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch("/api/create-account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        accountType,
      }),
    });

    const data = await response.json();

    console.log(data.message);
  } catch (error) {
    console.error("Failed to create account:", error);
  }
};



const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Account Type:", accountType);

    // later: send to database/API
*/