import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
export async function GET() {
  const client = await MongoClient.connect(uri, {});
  const db = client.db("Db_333");

  const availability = await db
    .collection("availability")
    .find({trainerId: "nigga"})
    .toArray();

  return NextResponse.json(availability);
}
 
export async function POST(request: Request) {
  const client = await MongoClient.connect(uri, {});
  const db = client.db("Db_333");

  const data = await request.json();

  const result = await db
    .collection("availability")
    .insertOne(data);

  return NextResponse.json(result);
}