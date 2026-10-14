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

  const trainer = await db.collection("trainer_acc").findOne({
    _id: new ObjectId(id),
  });

  return NextResponse.json(trainer);
}