"use client";

import { useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";

export default function CreateAccountPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("client");
  const [city, setCity] = useState("");
  const [suburb, setSuburb] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    if (accountType === "trainer" && (!city || !suburb)) {
      alert("Please fill in city and suburb.");
      return;
    }

    const body =
      accountType === "trainer" // lets include city and suburb in the request body if the account type is trainer
        ? { name, email, password, accountType, city, suburb }
        : { name, email, password, accountType };

    try {
      const response = await fetch("/api/create-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to create account.");
      }

      console.log(data.message);
      router.push("/login");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to create account. Please try again."
      );
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

      {accountType === "trainer" && (
        <>
          <input
            type="text"
            placeholder="City"
            value={city}
            className="border p-2"
            onChange={(e) => setCity(e.target.value)}
          />

          <input
            type="text"
            placeholder="Suburb"
            value={suburb}
            onChange={(e) => setSuburb(e.target.value)}
            className="border p-2"
          />
        </>
      )}

      <div className="flex justify-center">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          Create Account
        </button>
      </div>
    </form>
  );
}

