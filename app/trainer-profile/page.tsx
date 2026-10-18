"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TrainerProfile() {
    const [trainer, setTrainer] = useState<any>(null);
    const [name, setName] = useState("");
    const [showProfileModal, setShowProfileModal] = useState(false); //used to show/hide the profile modal
    const [profile, setProfile] = useState({
        bio: "",
        name: "",
        email: "",
        city: "",
        suburb: "",
        password: "",
    });


  const router = useRouter();

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
     
    if (!storedName) {
      router.push("/login");
      return;
    }
    
    if (storedName) {
      setName(storedName);
    }

    loadProfile() 

  }, []);
 
  const loadProfile = async () =>{
    const trainerId = localStorage.getItem("userId");
    const response = await fetch(`/api/trainer/${trainerId}`);
    const data = await response.json();
    setTrainer(data)
  }
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("accountType");

    router.push("/login");
  };
  
 const handleProfileUpdate = async () => {
  const trainerId = localStorage.getItem("userId");

  const response = await fetch(
    `/api/trainer/${trainerId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    }
  );

  if (response.ok) {
    alert("Profile updated");

    await loadProfile();

    setShowProfileModal(false);
  }
};


  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Welcome, {name}
        </h1>

        
      </div>

         <div className="flex gap-4">
         <Link
             href="/create-session"
             className="rounded bg-blue-500 px-4 py-2 text-white"
         >
          Add / Edit Availability
         </Link>
        
          <div> 
            <button  onClick={() => setShowProfileModal(true)}
                    className="rounded bg-blue-500 px-4 py-2 text-white"
            >
             Update Profile   
            </button>
            
          </div>

        <button
          onClick={handleLogout}
          className="rounded bg-red-500 px-4 py-2 text-white"
        >
          Logout
        </button>
        </div>
        
        {showProfileModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                <div className="w-96 rounded bg-white p-6">
                <h2 className="mb-4 text-xl font-bold">
                    Update Profile
                </h2>

               <input
                type="text"
                placeholder="name"
                value={profile.name}
                onChange={(e) =>
                    setProfile({
                    ...profile,
                    name: e.target.value,
                    })
                }
                className="mb-2 w-full rounded border p-2"
                />

                <input
                type="email"
                placeholder="email"
                value={profile.email}
                onChange={(e) =>
                    setProfile({
                    ...profile,
                    email: e.target.value,
                    })
                }
                className="mb-4 w-full rounded border p-2"
                />

                <input
                type="text"
                placeholder="city"
                value={profile.city}
                onChange={(e) =>
                    setProfile({
                    ...profile,
                    city: e.target.value,
                    })
                }
                className="mb-4 w-full rounded border p-2"
                />

                <input
                type="text"
                placeholder="suburb"
                value={profile.suburb}
                onChange={(e) =>
                    setProfile({
                    ...profile,
                    suburb: e.target.value,
                    })
                }
                className="mb-4 w-full rounded border p-2"
                />

                <input
                type="text"
                placeholder="bio"
                value={profile.bio}
                onChange={(e) =>
                    setProfile({
                    ...profile,
                    bio: e.target.value,
                    })
                }
                className="mb-4 w-full rounded border p-2"
                />

                <input
                type="password"
                placeholder="password"
                value={profile.password}
                onChange={(e) =>
                    setProfile({
                    ...profile,
                    password: e.target.value,
                    })
                }
                className="mb-4 w-full rounded border p-2"
                />

                <div className="flex gap-2">
                <button
                    onClick={handleProfileUpdate}
                    className="rounded bg-green-500 px-4 py-2 text-white"
                >
                    Save
                </button>

                <button
                    onClick={() => setShowProfileModal(false)}
                    className="rounded bg-red-500 px-4 py-2 text-white"
                >
                    Cancel
                </button>
                </div>               </div>
                                </div>

        )}
                        
      </div>

  );
}