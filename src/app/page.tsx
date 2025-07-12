import Nav from "@/components/Nav";
import CheckerForm from "@/components/CheckerForm";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl sm:text-8xl font-bold leading-none tracking-tight">
          The Home
          <br className="hidden md:block" /> Network
          <br className="hidden md:block" /> for&nbsp;the&nbsp;World
        </h1>
        <p className="mt-6 max-w-md text-lg text-lineaPurple/80 dark:text-zinc-300">
          Linea is the Ethereum L2 empowering the world to live on‑chain. Check
          your airdrop below.
        </p>
        <CheckerForm />
      </main>
    </>
  );
}
