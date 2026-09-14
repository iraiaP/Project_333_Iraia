import { MongoClient } from "mongodb";
import { Client } from "@/models/Client";
import { Trainer } from "@/models/Trainer";

const uri = process.env.MONGODB_URI!;
let user: Client | Trainer;

export async function POST(request: Request) {}