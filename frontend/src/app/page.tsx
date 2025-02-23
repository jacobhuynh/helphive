import { Landing } from "@/components/landing";
import { Nav } from "@/components/nav";
import { About } from "@/components/about";
import { Numbers } from "@/components/numbers";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Landing />
        <About />
        <Numbers />
        <Footer />
      </main>
    </div>
  );
}
