"use client";
/* 
          This page is for Trainers profile - from Trainer POV
*/
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TrainerProfile() {
    const [trainer, setTrainer] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [showProfileModal, setShowProfileModal] = useState(false); //used to show/hide the profile modal
    const [profile, setProfile] = useState({
      firstName: "",
      lastName: "",
      email: "",
      city: "",
      suburb: "",
      bio: "",
    });
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [trainerId, setTrainerId] = useState<string | null>(null);
 


  const router = useRouter();


useEffect(() => {
  const id = localStorage.getItem("userId");

  if (!id) {
    router.push("/login");
    return;
  }

  setTrainerId(id);
  loadProfile(id);
  loadBookings();
}, [router]);

  /**
   *      All Functions below here
   * 
   */

  const loadProfile = async (id: string) => {
    const response = await fetch(`/api/trainers/${id}`);

    if (!response.ok) {
      console.error("Could not load trainer profile");
      return;
    }

    const data = await response.json();

    setTrainer(data);

    // Fill the update form with existing details
    setProfile({
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      city: data.city || "",
      suburb: data.suburb || "",
      bio: data.bio || "",
    });
  };

  
  const loadBookings = async () => {

    const response = await fetch(
      `/api/bookings/trainer`
    );

    const data = await response.json();

    setBookings(data);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("accountType");

    router.push("/login");
  };
  
 
  const handleProfileUpdate = async () => {
    if (!trainerId) return;

    const response = await fetch(`/api/trainerProfile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    });

    if (response.ok) {
      alert("Profile updated successfully!");
      await loadProfile(trainerId);
      setShowProfileModal(false);
    } else {
      alert("Could not update profile.");
    }
  };

  
  // Cancel a booking from the trainer dashboard
  const handleCancelBooking = async (bookingId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(bookingId);

      const response = await fetch("/api/bookings/trainer", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel booking");
      }

      // Remove the cancelled booking from the dashboard
      setBookings((previousBookings) =>
        previousBookings.filter(
          (booking) => booking._id !== bookingId
        )
      );

      alert("Booking cancelled successfully!");
    } catch (error) {
      console.error("Cancellation error:", error);
      alert("Unable to cancel booking. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };



  return (
    <div className="p-6">

      {/* Welcome heading */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Welcome, {trainer?.firstName} {trainer?.lastName}
        </h1>
      </div>

      {/* Upcoming bookings */}
      <h2 className="mb-4 mt-8 text-2xl font-bold">
        Upcoming Bookings
      </h2>

      
      {/* Upcoming bookings container */}
      <div className="max-h-80 max-w-3xl overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3">

        {bookings.length === 0 ? (
          <p className="text-sm text-gray-500">
            No bookings found.
          </p>
        ) : (
          <div className="space-y-2">
            {bookings.map((booking: any) => (
              <div
                key={booking._id}
                className="rounded-lg border border-gray-200 bg-white px-4 py-3"
              >
                {/* Client name */}
                <p className="text-sm font-semibold text-gray-900">
                  {booking.clientName || "Unknown Client"}
                </p>

                {/* Booking date */}
                <p className="mt-1 text-sm text-gray-600">
                  <strong>Date:</strong>{" "}
                  {new Date(booking.startTime).toLocaleDateString(
                    "en-NZ",
                    {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      timeZone: "Pacific/Auckland",
                    }
                  )}
                </p>

                {/* Booking time */}
                <p className="text-sm text-gray-600">
                  <strong>Time:</strong>{" "}
                  {new Date(booking.startTime).toLocaleTimeString(
                    "en-NZ",
                    {
                      hour: "numeric",
                      minute: "2-digit",
                      timeZone: "Pacific/Auckland",
                    }
                  )}
                  {" - "}
                  {new Date(booking.endTime).toLocaleTimeString(
                    "en-NZ",
                    {
                      hour: "numeric",
                      minute: "2-digit",
                      timeZone: "Pacific/Auckland",
                    }
                  )}
                </p>

                {/* Cancel button */}
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleCancelBooking(booking._id)}
                    disabled={cancellingId !== null}
                    className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {cancellingId === booking._id
                      ? "Cancelling..."
                      : "Cancel Booking"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>


      {/* Dashboard actions */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href="/create-session"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Add / Edit Availability
        </Link>

        <button
          onClick={() => setShowProfileModal(true)}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Update Profile
        </button>

        <button
          onClick={handleLogout}
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Update profile modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6">

            <h2 className="mb-4 text-xl font-bold">
              Update Profile
            </h2>

            {/* First Name */}
            <label className="mb-1 block text-sm font-medium">
              First Name
            </label>

            <input
              type="text"
              value={profile.firstName}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  firstName: e.target.value,
                })
              }
              className="mb-3 w-full rounded border p-2"
            />

            {/* Last Name */}
            <label className="mb-1 block text-sm font-medium">
              Last Name
            </label>

            <input
              type="text"
              value={profile.lastName}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  lastName: e.target.value,
                })
              }
              className="mb-3 w-full rounded border p-2"
            />

            {/* Email */}
            <label className="mb-1 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  email: e.target.value,
                })
              }
              className="mb-3 w-full rounded border p-2"
            />

            {/* City */}
            <label className="mb-1 block text-sm font-medium">
              City
            </label>

            <input
              type="text"
              value={profile.city}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  city: e.target.value,
                })
              }
              className="mb-3 w-full rounded border p-2"
            />

            {/* Suburb */}
            <label className="mb-1 block text-sm font-medium">
              Suburb
            </label>

            <input
              type="text"
              value={profile.suburb}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  suburb: e.target.value,
                })
              }
              className="mb-3 w-full rounded border p-2"
            />

            {/* Bio */}
            <label className="mb-1 block text-sm font-medium">
              Bio
            </label>

            <textarea
              value={profile.bio}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  bio: e.target.value,
                })
              }
              placeholder="Tell clients about yourself..."
              rows={4}
              className="mb-4 w-full rounded border p-2"
            />

            {/* Modal buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowProfileModal(false)}
                className="rounded border px-4 py-2 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleProfileUpdate}
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

