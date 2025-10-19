"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="bg-pink-600">
        <section className="flex flex-col md:flex-row items-end justify-between text-white px-6 md:px-12 pt-30 md:pt-20 pb-0 max-w-7xl mx-auto">
          {/* Left Side: Text */}
          <div className="md:w-1/2 space-y-6 md:mb-20">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Welcome to <span className="text-cyan-400">HostelHub</span>
            </h1>
            <p className="text-lg md:text-xl py-1 text-white/90">
              A professional Hostel Room Allocation System designed to make
              managing hostels easy, efficient, and error-free. Say goodbye to
              double-bookings and manual paperwork.
            </p>
            <Link
              href="/getstarted"
              className="inline-block bg-cyan-400 text-pink-700 font-semibold px-6 py-2.5 rounded-full shadow-lg hover:bg-cyan-300 transition duration-300"
            >
              Get Started
            </Link>
          </div>

          {/* Right Side: Illustration */}
          <div className="md:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0">
            <img
              src="./hostel.png"
              alt="hostel"
              className="w-[18rem] md:w-[22rem] lg:w-[26rem] object-contain translate-y-0 md:translate-y-6.5 opacity-90"
            />
          </div>
        </section>
      </div>

      {/* Features Section */}
      <section className="bg-pink-100 py-20 px-6 md:px-20">
        <h2 className="text-3xl font-bold text-center text-gray-600 mb-12">
          Why Choose HostelHub?
        </h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 text-center">
            <h3 className="text-xl font-semibold text-pink-600 mb-3">
              Error-Free Allocation
            </h3>
            <p className="text-gray-600">
              Automatic room allocation ensures no double bookings and easy
              management of student assignments.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 text-center">
            <h3 className="text-xl font-semibold text-pink-600 mb-3">
              Real-Time Vacancy
            </h3>
            <p className="text-gray-600">
              Track hostel vacancies in real-time, update records instantly, and
              generate reports anytime.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 text-center">
            <h3 className="text-xl font-semibold text-pink-600 mb-3">
              Admin Dashboard
            </h3>
            <p className="text-gray-600">
              A sleek dashboard to manage students, rooms, allocations, and
              reports efficiently in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <div className="bg-cyan-400 text-pink-700">
        <section className="max-w-7xl mx-auto py-20 px-6 md:px-20 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to simplify hostel management?
            </h2>
            <p className="text-lg">
              Login now and start managing student accommodations efficiently and
              professionally.
            </p>
          </div>
          <div className="md:w-1/3 mt-6 md:mt-0 flex justify-center md:justify-end">
            <Link
              href="/getstarted"
              className="bg-pink-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-pink-700 transition duration-300"
            >
              Get Started
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
