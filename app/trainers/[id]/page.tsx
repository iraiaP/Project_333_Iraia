"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function TrainerProfilePage() {
  const params = useParams();
  const id = params.id;

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

      <div> 
        <h2> Bio</h2>
        <p>{trainer.bio}</p>
      </div>

    <Link href={'/book-trainer'}>
            <button>Book Session</button>
        </Link>
    </div>
  );
}
 