import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI!;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

    const { id } = await params;
    const client = await MongoClient.connect(uri);
    const db = client.db("Db_333");
    const sessions = await db
        .collection("availability")
        .find({ trainerId: new ObjectId(id) })
        .toArray();

  return NextResponse.json(sessions);
}

