"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FindTrainerPage() {
  const [trainers, setTrainers] = useState<any[]>([]);

 

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    const response = await fetch("/api/trainers");
    const data = await response.json();

    setTrainers(data);
  };

  let currentCity = "";
  const sortedTrainers = [...trainers].sort((a, b) =>
      (a.city || "").trim().localeCompare(
        (b.city || "").trim(),
        "en-NZ",
        { sensitivity: "base" }
      )
  );

 return (
  <div style={{ padding: "20px" }}>
    <div className="mb-6 flex items-center gap-3">
      <Link href="/">
        <img
          src="/home.svg"
          alt="Home"
          className="h-8 w-8"
        />
      </Link>

      <Link href="/clients">
        <img
          src="/profile-image.svg"
          alt="Client profile"
          className="h-8 w-8"
        />
      </Link>
    </div>
    <h1>
      <strong>
        Find a Trainer
      </strong>
    </h1>

    {sortedTrainers.map((trainer: any) => {
      const showCityHeading = trainer.city !== currentCity;

      if (showCityHeading) { // Update the current city to the trainer's city
        currentCity = trainer.city;
      }

      return (
        <div key={trainer._id}>
          {showCityHeading && (
            <h2 style={{ marginTop: "30px" }}>
              {trainer.city}
            </h2>
          )}

          <div
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <h3 >
              <Link
                href={`/trainers/${trainer._id}`}
                className="hover:text-blue-600"
              >
                {`${trainer.firstName || ""} ${trainer.lastName || ""}`.trim() ||
                  trainer.name ||
                  "Name TBC, still Book"}
              </Link>
            </h3>

            <p>{trainer.suburb}</p>

          </div>
        </div>
      );
    })}
  </div>
);
}
