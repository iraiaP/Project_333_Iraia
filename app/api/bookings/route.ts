import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI!;

export async function POST(request: Request) {
  const client = await MongoClient.connect(uri);
  const db = client.db("Db_333");

  const {trainerId, availabilityId, clientId } = await request.json();

  const session = await db.collection("availability").findOne({
    _id: new ObjectId(availabilityId),
  });

  if (!session) {
    return NextResponse.json(
      { error: "Session not found" },
      { status: 404 }
    );
  }

  await db.collection("Bookings").insertOne({
  trainerId: new ObjectId(trainerId),
  availabilityId: new ObjectId(availabilityId),
  clientId: clientId,
  startTime: session.startTime,
  endTime: session.endTime,
  bookedAt: new Date(),
});

  await db.collection("availability").deleteOne({
    _id: new ObjectId(availabilityId),
  });

  return NextResponse.json({
    success: true,
  });
}