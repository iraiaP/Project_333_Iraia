
import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI!;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Validate MongoDB ID
  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid trainer ID" },
      { status: 400 }
    );
  }

  const client = await MongoClient.connect(uri);

  try {
    const db = client.db("Db_333");

    const trainer = await db
      .collection("trainer_acc")
      .findOne(
        { _id: new ObjectId(id) },
        {
          // stops hashed pw getting returned
          projection: {
            password: 0,
          },
        }
      );

    if (!trainer) {
      return NextResponse.json(
        { error: "Trainer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(trainer);
  } catch (error) {
    console.error("Error fetching trainer:", error);

    return NextResponse.json(
      { error: "Failed to fetch trainer" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
