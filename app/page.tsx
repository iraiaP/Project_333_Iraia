import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">

      <div className="fixed top-0 left-0 flex h-16 w-full items-center justify-start px-4">
        <Link href="/create-account" className="rounded bg-blue-500 px-4 py-2 text-white">
          <button className="rounded bg-blue-500 px-4 py-2 text-white">  
            Create account  
          </button>
        </Link>
      </div>

      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert h-5 w-[100px]"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            THis will eventually become our Title page that connects to the rest of the app. 
            <p>   Leave for now </p>
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
             Find a Trainer
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          
        </div>
      </main>
    </div>
  );
}
