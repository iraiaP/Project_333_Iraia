
"use client";

/**
 * Client booking page
 * Displays a trainer's available sessions by date.
 */

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Session = {
  _id: string;
  startTime: string;
  endTime: string;
};

type Trainer = {
  name?: string;
  firstName?: string;
  lastName?: string;
};

export default function BookSessionPage() {
  const params = useParams();
  const id = params.id as string;

  const [sessions, setSessions] = useState<Session[]>([]);
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [selectedDay, setSelectedDay] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // Load trainer details and availability
  useEffect(() => {
    if (id) {
      loadSessions();
      getTrainer();
    }
  }, [id]);

  // Get trainer details
  const getTrainer = async () => {
    try {
      const response = await fetch(`/api/trainers/${id}`);

      if (!response.ok) {
        throw new Error("Failed to load trainer");
      }

      const data = await response.json();
      setTrainer(data);
    } catch (error) {
      console.error("Trainer error:", error);
    }
  };

  // Get available sessions
  const loadSessions = async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/availability/${id}`);

      if (!response.ok) {
        throw new Error("Failed to load availability");
      }

      const data: Session[] = await response.json();

      // Only show sessions that haven't started yet
      const futureSessions = data
        .filter((session) => new Date(session.startTime) > new Date())
        .sort(
          (a, b) =>
            new Date(a.startTime).getTime() -
            new Date(b.startTime).getTime()
        );

      setSessions(futureSessions);
    } catch (error) {
      console.error("Availability error:", error);
      setMessage("Unable to load sessions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get the actual NZ calendar date (YYYY-MM-DD)
  const getDateKey = (date: string) => {
    const parts = new Intl.DateTimeFormat("en-NZ", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Pacific/Auckland",
    }).formatToParts(new Date(date));

    const year = parts.find((part) => part.type === "year")?.value;
    const month = parts.find((part) => part.type === "month")?.value;
    const day = parts.find((part) => part.type === "day")?.value;

    return `${year}-${month}-${day}`;
  };

  // Group sessions by their actual dates
  const groupedSessions: Record<string, Session[]> = {};

  sessions.forEach((session) => {
    const date = getDateKey(session.startTime);

    if (!groupedSessions[date]) {
      groupedSessions[date] = [];
    }

    groupedSessions[date].push(session);
  });

  // Sort dates from earliest to latest
  const availableDates = Object.keys(groupedSessions).sort();

  // Automatically select the first available date
  const activeDay = availableDates.includes(selectedDay)
    ? selectedDay
    : availableDates[0];

  const selectedSessions = groupedSessions[activeDay] || [];

  // Format dates for display
  const formatDate = (date: string) => {
    const [year, month, day] = date.split("-").map(Number);

    return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(
      "en-NZ",
      {
        weekday: "short",
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      }
    );
  };

  // Format session times in NZ time
  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-NZ", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Pacific/Auckland",
    });
  };

  // Book a session
  const bookSession = async (sessionId: string) => {
    const clientId = localStorage.getItem("userId");

    if (!clientId) {
      setMessage("Please log in before booking a session.");
      return;
    }

    try {
      setBookingId(sessionId);
      setMessage("");

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trainerId: id,
          availabilityId: sessionId,
          clientId,
        }),
      });

      if (!response.ok) {
        throw new Error("Booking failed");
      }

      setMessage("Session booked successfully!");

      // Refresh availability after booking
      await loadSessions();
    } catch (error) {
      console.error("Booking error:", error);
      setMessage("Unable to book session. Please try again.");
    } finally {
      setBookingId(null);
    }
  };

  // Trainer display name
  const trainerName = trainer
    ? `${trainer.firstName || ""} ${trainer.lastName || ""}`.trim() ||
      trainer.name ||
      "Trainer"
    : "Trainer";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900">
      <main className="mx-auto max-w-5xl">

        {/* Navigation */}
        <Link
          href="/trainers"
          className="mb-8 inline-flex items-center gap-2 text-blue-600 hover:underline"
        >
          ← Back to Trainers
        </Link>

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Book a Session
          </h1>

          <p className="mt-2 text-gray-500">
            Select an available time with your personal trainer.
          </p>
        </div>

        {/* Trainer card */}
        <div className="mb-8 flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
            {trainerName.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              {trainerName}
            </h2>

            <p className="text-sm text-gray-500">
              Personal Trainer
            </p>
          </div>
        </div>

        {/* Availability section */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold">
            Available Sessions
          </h2>

          {loading ? (
            <p className="text-gray-500">
              Loading availability...
            </p>
          ) : sessions.length === 0 ? (
            /* No sessions available */
            <div className="rounded-lg bg-gray-50 px-6 py-12 text-center">
              <div className="mb-3 text-4xl">
                📅
              </div>

              <h3 className="text-lg font-semibold">
                No sessions available yet
              </h3>

              <p className="mt-2 text-gray-500">
                This trainer has no upcoming sessions available.
                Please check back later.
              </p>
            </div>
          ) : (
            <>
              {/* Available date buttons */}
              <div className="flex gap-3 overflow-x-auto pb-3">
                {availableDates.map((date) => {
                  const count = groupedSessions[date].length;
                  const isSelected = activeDay === date;

                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDay(date)}
                      className={`min-w-32 rounded-lg border p-3 text-center transition ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div className="font-semibold">
                        {formatDate(date)}
                      </div>

                      <div className="mt-2 text-xs">
                        {count} available
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected date's sessions */}
              <div className="mt-8">
                <h3 className="mb-4 text-lg font-semibold">
                  Sessions for {formatDate(activeDay)}
                </h3>

                {selectedSessions.length === 0 ? (
                  <div className="rounded-lg bg-gray-50 p-6 text-center text-gray-500">
                    No sessions available on this day.
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {selectedSessions.map((session) => (
                      <div
                        key={session._id}
                        className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                      >
                        <div>
                          <p className="font-semibold">
                            {formatTime(session.startTime)}
                          </p>

                          <p className="text-sm text-gray-500">
                            Until {formatTime(session.endTime)}
                          </p>
                        </div>

                        <button
                          onClick={() => bookSession(session._id)}
                          disabled={bookingId !== null}
                          className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                          {bookingId === session._id
                            ? "Booking..."
                            : "Book"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Success or error message */}
          {message && (
            <p
              role="status"
              className="mt-5 rounded-lg bg-gray-100 p-3 text-center text-sm"
            >
              {message}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
