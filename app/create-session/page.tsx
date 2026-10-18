"use client";

import BookingCalendar from "@/components/BookingCalendar";
import Link from "next/link";
import { useRouter } from "next/navigation";



export default function Page() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("accountType");

        router.push("/login");
    };

return (
<main>
 <div className="mb-4 flex items-center justify-between">
      <h1>
        <strong>Booking Calendar</strong>
      </h1>

      <div className="flex items-center gap-4">
        <Link href="/">
        <img src="/home.svg"
            className="h-8 w-8"/>
          
        </Link>

        <Link href="/trainer-profile">
         <img src="/profile-image.svg"
            className="h-6 w-8"/>
        </Link>

        <button onClick={handleLogout}>
          <img src="/logout.svg"
            className="h-8 w-8"/>
        </button>
      </div>
    </div>
<div>Click empty slot to create availability, click again to edit</div>
<BookingCalendar />
</main>
);
}