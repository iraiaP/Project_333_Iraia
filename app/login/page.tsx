"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    console.log(data);
    
    setUser(data.user);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Search</button>
      </form>

      {user && (
        <div>
          <h2>User Found</h2>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Account Type: {user.accountType}</p>
        </div>
      )}
    </div>
  );
}