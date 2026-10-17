"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  const [accountType, setAccountType] = useState("client");

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
        accountType,
      }),
    });

    if (!response.ok) {
      alert("Invalid email or password");
      return;
    }

      const router = useRouter();
      const data = await response.json();


      setUser(data.user);

      localStorage.setItem("userId", data.user._id);
      localStorage.setItem("accountType", accountType);
      if(accountType === "trainer" ){
        localStorage.setItem("userName", data.user.name)
      }else{
        localStorage.setItem("userName", data.user.firstName);
      }
      

    // Redirect to the appropriate page after successful login
      if (accountType === "client") {
        router.push("/clients");
        } else {
        router.push("/trainer");
        }
    };

  return (
    <div>
      <h1 className="text-3xl underline mb-4">
        <strong>Login</strong>
      </h1>
      <br />
      <form onSubmit={handleSubmit}>
        <div>
          <input className="border border-gray-300 rounded px-2 py-1 mb-2"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <input className="border border-gray-300 rounded px-2 py-1 mb-2"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 mb-2"
          >
            <option value="client">Client</option>
            <option value="trainer">Trainer</option>
          </select>
        </div>

        <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white">
          Login
        </button>
      </form>

    </div>
  );
}