"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ClientDashboard() {
  const [clientName, setClientName] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedName = localStorage.getItem("userName");

    if (!storedName) {
      router.push("/login");
      return;
    }

    setClientName(storedName);
    loadBookings();

  }, []);
  const loadBookings = async () => {
    const clientId = localStorage.getItem("userId");
    // Implement booking loading logic here
    const response = await fetch(`/api/bookings/${clientId}`);
    const data = await response.json();
    setBookings(data);
  };

  const handleLogout = () => {
    localStorage.removeItem("clientId");
    localStorage.removeItem("clientName");

    router.push("/login");
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Welcome, {clientName}
        </h1>

        <button
          onClick={handleLogout}
          className="rounded bg-red-500 px-4 py-2 text-white"
        >
          Logout
        </button>
      </div>

         <div className="flex gap-4">
         <Link
             href="/trainers"
             className="rounded bg-blue-500 px-4 py-2 text-white"
         >
          Find a Trainer
         </Link>
        
         <h2>My Bookings</h2>

        <div> 
            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                bookings.map((booking: any) => (
                <div
                    key={booking._id}
                    className="mb-3 rounded border p-4"
                >
                    <p>
                    <strong>Date:</strong>{" "}
                    {new Date(
                        booking.startTime
                    ).toLocaleDateString("en-NZ")}
                    </p>

                    <p>
                    <strong>Time:</strong>{" "}
                    {new Date(
                        booking.startTime
                    ).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                    })}
                    {" - "}
                    {new Date(
                        booking.endTime
                    ).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                    })}
                    </p>
                </div>
                ))
            )}
</div>

        </div>
        
      </div>

  );
}