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
  //code to handle log out
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("accountType");

    router.push("/login");
  };

//  Code to cancel session from profile page

  const handleCancelBooking = async (bookingId: string) => {
    // Ask the client to confirm
    if (!window.confirm("Cancel this booking?")) return;

    const response = await fetch(`/api/bookings/${bookingId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      // Remove the cancelled booking from the screen
      setBookings((prev: any[]) =>
        prev.filter((booking) => booking._id !== bookingId)
      );
    } else {
      alert("Could not cancel booking.");
    }
  };


return (
  <div className="min-h-screen bg-gray-50 px-6 py-8">
    <div className="mx-auto max-w-5xl">

      {/* Header */}
      <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {clientName} 👋
          </h1>
          <p className="mt-2 text-gray-500">
            Manage your training sessions and bookings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/" title="Home">
            <img
              src="/home.svg"
              alt="Home"
              className="h-9 w-9"
            />
          </Link>

          <Link href="/clients" title="My Profile">
            <img
              src="/profile-image.svg"
              alt="Profile"
              className="h-9 w-9"
            />
          </Link>

          <Link
            href="/clients/edit-profile"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Edit Profile
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Find Trainer */}
      <div className="mb-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Find Your Next Trainer
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Explore trainers and book your next session.
            </p>
          </div>

          <Link
            href="/trainers"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Find a Trainer →
          </Link>
        </div>
      </div>

      {/* Bookings Section */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            My Bookings
          </h2>

          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            {bookings.length} {bookings.length === 1 ? "Booking" : "Bookings"}
          </span>
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-medium text-gray-700">
              No bookings yet
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Find a trainer to schedule your first session.
            </p>

            <Link
              href="/trainers"
              className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
            >
              Browse Trainers
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {bookings.map((booking: any) => (
              <div
                key={booking._id}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    Training Session
                  </h3>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    Booked
                  </span>
                </div>

                <div className="space-y-3 text-sm text-gray-700">
                  {/* Trainer Name */}
                  <div>
                    <p className="text-xs text-gray-500">
                      Trainer
                    </p>
                    <p className="font-medium">
                      {booking.trainerName || "Unknown Trainer"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-xs text-gray-500">
                        Date
                      </p>
                      <p className="font-medium">
                        {new Date(
                          booking.startTime
                        ).toLocaleDateString("en-NZ", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-xs text-gray-500">
                        Time
                      </p>
                      <p className="font-medium">
                        {new Date(
                          booking.startTime
                        ).toLocaleTimeString("en-NZ", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                        {" – "}
                        {new Date(
                          booking.endTime
                        ).toLocaleTimeString("en-NZ", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-auto flex justify-end pt-6">
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  </div>
);

}