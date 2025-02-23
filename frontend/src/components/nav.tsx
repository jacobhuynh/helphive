import Link from "next/link";
import Image from "next/image";

export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-16">
        <nav className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <span className="text-black font-bold text-lg">HelpHive</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {/* Mission Link with underline animation */}
            <div className="relative group">
              <Link
                href="#mission"
                className="text-gray-900 hover:text-green-500 transition-colors"
              >
                Mission
              </Link>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
            </div>
            {/* About Us Link with underline animation */}
            <div className="relative group">
              <Link
                href="#about"
                className="text-black hover:text-green-500 transition-colors"
              >
                About Us
              </Link>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
            </div>
            {/* Contact Us Link with underline animation */}
            <div className="relative group">
              <Link
                href="#contact"
                className="text-black hover:text-green-500 transition-colors"
              >
                Contact Us
              </Link>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
            </div>
          </div>
          {/* Sign In button with different hover shade and scale animation */}
          <Link
            href="#"
            className="bg-green-500 text-white px-6 py-2 rounded-lg font-bold transition-transform transform hover:bg-green-600 hover:scale-105"
          >
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
}
