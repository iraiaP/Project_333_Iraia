"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";


export default function BookSessionPage() {

  // Code to get the trainer ID from the URL parameters
  const params = useParams();
  const id = params.id as string;

  const [sessions, setSessions] = useState<any[]>([]);
  const [trainer, setTrainer] = useState<any>(null);
  useEffect(() => {

    if (id) {
      loadSessions();
      getTrainer();
    }
  }, [id]);

  const getTrainer = async () => {
    const response = await fetch(`/api/trainers/${id}`);
    const trainer = await response.json();
    setTrainer(trainer);
  }
  const loadSessions = async () => {
    console.log("Fetching sessions for trainer ID");

    const response = await fetch(`/api/availability/${id}`);

    const data = await response.json();

    setSessions(data);
  };

  //code to group the sessions by date
 const groupedSessions: any = sessions.reduce(
    (acc: any, session: any) => {
      const day = new Date(session.startTime).toLocaleDateString(
        "en-NZ",
        {
          weekday: "short",
        }
      );

      if (!acc[day]) {
        acc[day] = [];
      }

      acc[day].push(session);

      return acc;
    },
    {}
  );

//button click handler to book a session
  const bookSession = async (sessionId: string) => {
    await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trainerId: id,
        availabilityId: sessionId,
        clientId: localStorage.getItem("clientId"),
      }),
    });

    await loadSessions();
  };


return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">
        Available Sessions - {trainer?.name}
      </h1>

      <div className="grid grid-cols-7 gap-4">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
          (day) => (
            <div
              key={day}
              className="rounded border p-3"
            >
              <h2 className="mb-3 font-bold">
                {day}
              </h2>

              {(groupedSessions[day] || []).map(
                (session: any) => (
                  <div
                    key={session._id}
                    className="mb-2 rounded bg-gray-100 p-2"
                  >
                    <div>
                      {new Date(
                        session.startTime
                      ).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                      {" - "}
                      {new Date(
                        session.endTime
                      ).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>

                    <button 
                      className="mt-2 rounded bg-blue-500 px-2 py-1 text-white"
                      onClick={() => bookSession(session._id)}
                    >
                      Book
                    </button>
                  </div>
                )
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}