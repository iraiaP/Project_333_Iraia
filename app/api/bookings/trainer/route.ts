
import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

/**
 * 
 *    Route for getting a trainers booked sessions 
 *    + delteing booking on trainer side
 */

const uri = process.env.MONGODB_URI!;
    //trainer id comes from verified session cookie

export async function GET() {
  const session = await getSession();

  if (!session || session.accountType !== "trainer") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const client = await MongoClient.connect(uri);

  try {
    const db = client.db("Db_333");

    // Get this trainer's bookings
    const bookings = await db.collection("Bookings")
      .find({ trainerId: new ObjectId(session.userId) })
      .sort({ startTime: 1 })
      .toArray();

    // Get client names for each booking
    const bookingsWithClients = await Promise.all(
      bookings.map(async (booking) => {
        let clientName = "Unknown Client";

        if (booking.clientId && ObjectId.isValid(booking.clientId.toString())) {
          const clientAccount = await db.collection("Clients").findOne(
            { _id: new ObjectId(booking.clientId) },
            { projection: { firstName: 1, lastName: 1, name: 1 } }
          );

          if (clientAccount) {
            clientName =
              [clientAccount.firstName, clientAccount.lastName]
                .filter(Boolean)
                .join(" ") ||
              clientAccount.name ||
              "Unknown Client";
          }
        }

        return { ...booking, clientName };
      })
    );

    return NextResponse.json(bookingsWithClients);
  } finally {
    await client.close();
  }
}


/**
 * Cancel a booking belonging to the logged-in trainer.
 */
export async function DELETE(request: Request) {
  const session = await getSession();

  // Only trainers can use this endpoint
  if (!session || session.accountType !== "trainer") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Get the booking ID from the request
  const { bookingId } = await request.json();

  if (
    typeof bookingId !== "string" ||
    !ObjectId.isValid(bookingId)
  ) {
    return NextResponse.json(
      { error: "Invalid booking ID" },
      { status: 400 }
    );
  }

  const client = await MongoClient.connect(uri);

  try {
    const db = client.db("Db_333");

    // Only delete bookings owned by this trainer
    const result = await db.collection("Bookings").deleteOne({
      _id: new ObjectId(bookingId),
      trainerId: new ObjectId(session.userId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Trainer cancellation error:", error);

    return NextResponse.json(
      { error: "Unable to cancel booking" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
