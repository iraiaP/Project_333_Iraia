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
      <Link href="/">
        <img src = "/home.svg" 
          className="h-8 w-8"/>
      </Link>

    <h1>
      <strong>
        {trainer.firstName} {trainer.lastName}
      </strong>
    </h1>
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
      <div> 
        <h2> 
          <strong>Bio </strong>
        </h2>
        <p>{trainer.bio}</p>
      
      </div >
      <br/>
        <Link href={'/trainers/' + id + '/book'}
        className="rounded bg-blue-500 px-4 py-2 text-white">        
            Available Sessions 
        </Link>
    </div>
  );
}
 