"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function BookSessionPage() {
  const params = useParams();
  const id = params.id;

  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    loadSessions();
  }, []);

 const loadSessions = async () => {
  const response = await fetch(`/api/availability/${id}`);
  const data = await response.json();

  setSessions(data);
};



}

