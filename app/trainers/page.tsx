"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FindTrainerPage() {
  const [trainers, setTrainers] = useState<any[]>([]);

  const trainersByCity = trainers.reduce((groups: any, trainer: any) => {
    if (!groups[trainer.city]) {
      groups[trainer.city] = [];
    }

    groups[trainer.city].push(trainer);

    return groups;
  }, {}); 

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    const response = await fetch("/api/trainers");
    const data = await response.json();

    setTrainers(data);
  };

  let currentCity = "";

 return (
  <div style={{ padding: "20px" }}>
    <h1>Find a Trainer</h1>

    {trainers.map((trainer: any) => {
      const showCityHeading = trainer.city !== currentCity;

      if (showCityHeading) {
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
            <h3>{trainer.name}</h3>

            <p>{trainer.suburb}</p>

          </div>
        </div>
      );
    })}
  </div>
);
}

/*



     {Object.entries(trainersByCity).map(
        ([city, cityTrainers]: any) => (
          <div key={city} style={{ marginBottom: "30px" }}>
            <h2>{city}</h2>

            {cityTrainers.map((trainer: any) => (
              <div
                key={trainer._id}
                style={{
                  border: "1px solid #ccc",
                  padding: "15px",
                  marginBottom: "10px",
                  borderRadius: "8px",
                }}
              >
                <h3>{trainer.name}</h3>

                <p>{trainer.suburb}</p>

                <Link href={`/trainers/${trainer._id}`}>
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        )
      )}

*/


/*  
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function TrainerProfilePage() {
  const { id } = useParams();

  const [trainer, setTrainer] = useState<any>(null);

  useEffect(() => {
    loadTrainer();
  }, []);

  const loadTrainer = async () => {
    const response = await fetch(`/api/trainers/${id}`);
    const data = await response.json();

    setTrainer(data);
  };

  if (!trainer) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{trainer.name}</h1>

      <p>
        <strong>City:</strong> {trainer.city}
      </p>

      <p>
        <strong>Suburb:</strong> {trainer.suburb}
      </p>

      <p>
        <strong>Email:</strong> {trainer.email}
      </p>

      <br />

      <Link href={`/trainers/${trainer._id}/       <button>Book Session</button>
      </Link>
    </div>
  );
}

*/