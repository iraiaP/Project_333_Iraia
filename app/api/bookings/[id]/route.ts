
import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";


//Get and Delete inside this route.ts
const uri = process.env.MONGODB_URI!;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session || session.accountType !== "client") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  if (id !== session.userId) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const client = await MongoClient.connect(uri);

  try {
    const db = client.db("Db_333");

    const bookings = await db
      .collection("Bookings")
      .find({ clientId: session.userId })
      .sort({ startTime: 1 })
      .toArray();

    const trainers = db.collection("trainer_acc");

    const bookingsWithTrainers = await Promise.all(
      bookings.map(async (booking) => {
        console.log("Booking trainerId:", booking.trainerId); // debug check
        let trainerName = "Unknown Trainer";

      if (booking.trainerId && ObjectId.isValid(booking.trainerId.toString())) {
          const trainer = await trainers.findOne(
            { _id: new ObjectId(booking.trainerId) },
            {
              projection: {
                firstName: 1,
                lastName: 1,
                name: 1,
              },
            }
          );
          console.log("Trainer found:", trainer); // another check
          if (trainer) {
            trainerName =
              [trainer.firstName, trainer.lastName]
                .filter(Boolean)
                .join(" ") ||
              trainer.name ||
              "Unknown Trainer";
          }
        }

        return {
          ...booking,
          trainerName,
        };
      })
    );

    return NextResponse.json(bookingsWithTrainers);
  } finally {
    await client.close();
  }
}


export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();

  // Check the user is logged in as a client
  if (!session || session.accountType !== "client") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check the booking ID is valid
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const client = await MongoClient.connect(uri);

  try {
    const db = client.db("Db_333");

    // Delete the booking only if it belongs to this client
    const result = await db.collection("Bookings").deleteOne({
      _id: new ObjectId(id),
      clientId: session.userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Booking cancelled" });
  } finally {
    await client.close();
  }
}

