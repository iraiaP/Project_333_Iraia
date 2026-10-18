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

 return (
  <div style={{ padding: "20px" }}>

     <Link href="/">
      <img src = "/home.svg" 
        className="h-8 w-8"/>
    </Link>

    <h1>
      <strong>
        Find a Trainer
      </strong>
    </h1>

    {trainers.map((trainer: any) => {
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
              
              <Link href={`/trainers/${trainer._id}`}>
                <strong>{trainer.name} </strong>
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
