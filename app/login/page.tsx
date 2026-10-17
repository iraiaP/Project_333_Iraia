"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      alert("Invalid email or password");
      return;
    }

    const router = useRouter();
    const data = await response.json();

      
    localStorage.setItem("clientId", data.user._id);
    localStorage.setItem("clientName", data.user.firstName);

    setUser(data.user);
    // Redirect to the clients page after successful login
    router.push("/clients");
  };

  return (
    <div>
      <h1 className="text-3xl underline mb-4">
        <strong>Login</strong>
      </h1>
      <br />
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">
          Login
        </button>
      </form>

    </div>
  );
}