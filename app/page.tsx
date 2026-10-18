import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">

       <div className="fixed top-0 left-0 flex h-14 w-full items-center justify-start gap-4 px-4">
        <Link href="/create-account" className="rounded bg-blue-500 px-4 py-2 text-white">
          <button className="rounded bg-blue-500 px-4 py-2 text-white"> 
            Create account  
          </button>
        </Link>

         <Link href="/login" className="rounded bg-blue-500 px-4 py-2 text-white">
          <button className="rounded bg-blue-500 px-4 py-2 text-white">  
            Login  
          </button>
        </Link>
      </div>

      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Frickin Workkkk
            <p>   To Do:</p>
            <p>    
              make /[id]/book page look and function better         
            </p>
          </h1>
          <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/trainers" className="rounded bg-blue-500 px-4 py-2 text-white">
            <button className="rounded bg-blue-500 px-4 py-2 text-white">
              Find a Trainer
            </button>
          </Link>
          </div>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          
        </div>
      </main>
    </div>
  );
}
