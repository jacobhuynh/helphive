import { Leaf, Users, Award, TreePine } from "lucide-react";
import Image from "next/image";
import Talk from "../assets/talk.png";

export function About() {
  return (
    <section
      id="mission"
      className="w-full min-h-screen bg-white py-24 flex justify-center items-center"
    >
      <div className="container mx-auto px-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-yellow-100 via-green-50 to-emerald-300">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={Talk}
                alt="Talk"
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>
          </div>

          <div className="space-y-12">
            <h2 className="text-6xl font-bold text-gray-900">Our Mission</h2>

            <div className="space-y-6">
              <p className="text-gray-600 text-lg">
                We're more than just a volunteer platform. We're a movement
                driving meaningful connections between passionate individuals
                and impactful causes. Using AI and data-driven insights, we make
                finding the right opportunity seamless and effortless.
              </p>

              <p className="text-gray-600 text-lg">
                Whether it's local community projects or global environmental
                initiatives, we help volunteers create real and lasting change.
                Every opportunity is more than just a task. It's a step toward
                building a stronger community.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-12">
              <div className="bg-gradient-to-br from-yellow-50 to-green-50 rounded-xl p-6 border border-emerald-100 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-300">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <Leaf className="w-6 h-6" />
                  <span className="text-3xl font-bold">5+</span>
                </div>
                <p className="text-gray-600 text-sm">Years Active</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-green-50 rounded-xl p-6 border border-emerald-100 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-300">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <Users className="w-6 h-6" />
                  <span className="text-3xl font-bold">1000+</span>
                </div>
                <p className="text-gray-600 text-sm">Volunteers Matched</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-green-50 rounded-xl p-6 border border-emerald-100 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-300">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <TreePine className="w-6 h-6" />
                  <span className="text-3xl font-bold">100+</span>
                </div>
                <p className="text-gray-600 text-sm">Active Projects</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-green-50 rounded-xl p-6 border border-emerald-100 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-300">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <Award className="w-6 h-6" />
                  <span className="text-3xl font-bold">15+</span>
                </div>
                <p className="text-gray-600 text-sm">Impact Awards</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
