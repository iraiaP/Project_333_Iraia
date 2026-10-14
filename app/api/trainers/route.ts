import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI!;

export async function GET() {
  const client = await MongoClient.connect(uri);
  const db = client.db("Db_333");

  const trainers = await db
    .collection("trainer_acc")
    .find({})
    .toArray();

  return NextResponse.json(trainers);
}