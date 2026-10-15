import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI!;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
    const client = await MongoClient.connect(uri);
    const db = client.db("Db_333");
    const sessions = await db
        .collection("availability")
        .find({ _id: new ObjectId(params.id) })
        .toArray();

  return NextResponse.json(sessions);
}

