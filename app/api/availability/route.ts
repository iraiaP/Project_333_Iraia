import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";



 const uri = process.env.MONGODB_URI!;


 export async function GET() {
  const client = await MongoClient.connect(uri, {});
  const db = client.db("Db_333");
 
  const availability = await db
    .collection("availability")
    .find({trainerId: "test123"})
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

export async function DELETE(request: Request) {
  const client = await MongoClient.connect(uri);

  const db = client.db("Db_333");

  const { id } = await request.json();

  const result = await db.collection("availability").deleteOne({
    _id: new ObjectId(id),
  });

  return NextResponse.json(result);
}

export async function PUT(request: Request) {
  const client = await MongoClient.connect(uri);
  const db = client.db("Db_333");

  const {
  id,
  title,
  startTime,
  endTime,
  clientId,
} = await request.json();

  const result = await db.collection("availability").updateOne(
    { _id: new ObjectId(id) },
    { $set: {
        ...(title !== undefined && { title }),
        ...(startTime !== undefined && { startTime }),
        ...(endTime !== undefined && { endTime }),
        ...(clientId !== undefined && { clientId }),
      }}
  );

  return NextResponse.json(result);
}
