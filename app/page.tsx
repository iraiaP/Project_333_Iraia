
"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [goal, setGoal] = useState("Build muscle");
  const [experience, setExperience] = useState("Beginner");
  const [equipment, setEquipment] = useState("Full gym");
  const [duration, setDuration] = useState("45 minutes");
  const [notes, setNotes] = useState("");

  const [workout, setWorkout] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateWorkout() {
    setLoading(true);
    setError("");
    setWorkout("");

    try {
      const response = await fetch("/api/generate-workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal,
          experience,
          equipment,
          duration,
          notes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate workout");
      }

      const data = await response.json();
      setWorkout(data.workout);
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 p-6 font-sans dark:bg-black">

      {/* Navigation */}
      <div className="flex w-full gap-4">
        <Link
          href="/create-account"
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          Create account
        </Link>

        <Link
          href="/login"
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          Login
        </Link>
      </div>

      <main className="mt-16 flex w-full max-w-2xl flex-col gap-8">

        {/* Homepage title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Book A Trainer
          </h1>

          <p className="mt-3 text-zinc-600 dark:text-zinc-300">
            Find a personal trainer or generate your own workout!
          </p>

          <Link
            href="/trainers"
            className="mt-5 inline-block rounded bg-blue-500 px-5 py-3 text-white"
          >
            Find a Trainer
          </Link>
        </div>

        {/* Workout generator */}
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-zinc-900">

          <h2 className="mb-5 text-2xl font-semibold text-black dark:text-white">
            AI Workout Generator
          </h2>

          <div className="flex flex-col gap-4">

            {/* Goal */}
            <label className="text-black dark:text-white">
              Fitness Goal
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="mt-1 w-full rounded border p-2 text-black"
              >
                <option>Build muscle</option>
                <option>Build strength</option>
                <option>Lose weight</option>
                <option>Improve fitness</option>
              </select>
            </label>

            {/* Experience */}
            <label className="text-black dark:text-white">
              Experience Level
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="mt-1 w-full rounded border p-2 text-black"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </label>

            {/* Equipment */}
            <label className="text-black dark:text-white">
              Available Equipment
              <select
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                className="mt-1 w-full rounded border p-2 text-black"
              >
                <option>Full gym</option>
                <option>Home equipment</option>
                <option>Bodyweight only</option>
              </select>
            </label>

            {/* Duration */}
            <label className="text-black dark:text-white">
              Workout Duration
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="mt-1 w-full rounded border p-2 text-black"
              >
                <option>30 minutes</option>
                <option>45 minutes</option>
                <option>60 minutes</option>
              </select>
            </label>

            {/* Additional notes */}
            <label className="text-black dark:text-white">
              Additional Preferences (Optional)
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Upper body workout, avoid jumping..."
                className="mt-1 w-full rounded border p-2 text-black"
                rows={3}
              />
            </label>

            {/* Generate button */}
            <button
              onClick={generateWorkout}
              disabled={loading}
              className="rounded bg-blue-500 px-4 py-3 font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate Workout"}
            </button>

          </div>
        </div>

        {/* Workout result */}
        {error && (
          <p role="alert" className="text-red-500">{error}</p>
        )}

        {workout && (
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-zinc-900">
            <h2 className="mb-4 text-2xl font-semibold text-black dark:text-white">
              Your Workout
            </h2>

            <p className="whitespace-pre-wrap text-black dark:text-white">
              {workout}
            </p>
          </div>
        )}

      </main>
    </div>
  );
}

