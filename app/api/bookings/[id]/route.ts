import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI!;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = await MongoClient.connect(uri);
  const db = client.db("Db_333");

  const { id } = await params;

  const bookings = await db
    .collection("bookings")
    .find({
      clientId: new ObjectId(id),
    })
    .toArray();

  return NextResponse.json(bookings);
}