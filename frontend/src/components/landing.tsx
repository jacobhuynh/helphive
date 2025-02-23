import Image from "next/image";
import Bee from "../assets/bee.png";
import Hill from "../assets/hill.png";
import { ChevronDown } from "lucide-react";

export function Landing() {
  return (
    <div className="h-screen relative">
      <div className="fixed inset-0 bg-gradient-to-br from-yellow-100 via-green-50 to-emerald-300 -z-10" />
      <main className="relative min-h-screen flex items-center">
        <div className="container mx-auto px-16">
          <div className="relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">
                Volunteering Opportunities That Match{" "}
                <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
                  Your Passion
                </span>
              </h1>
              <p className="text-lg text-gray-400 mb-8 max-w-xl">
                Set your preferences and get matched with meaningful causes to
                make a difference in your community
              </p>
              <button className="bg-green-500 text-white px-12 py-4 rounded-xl transition-colors font-bold hover:bg-green-600 hover:scale-105">
                Join Us
              </button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 right-0 w-full h-[100vh] transform -skew-y-[18deg] origin-bottom-right">
            <Image
              src={Hill}
              alt="Hill"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute top-1/2 right-[8%] -translate-y-1/2 w-[500px] h-[500px] mb-12">
            <Image
              src={Bee}
              alt="Bee"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <ChevronDown className="w-10 h-10 text-white animate-bounce" />
        </div>
      </main>
    </div>
  );
}
