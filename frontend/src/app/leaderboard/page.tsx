"use client";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/joy/CircularProgress";
import Image from "next/image";
import Medal1 from "../../assets/medal_1.png";
import Medal2 from "../../assets/medal_2.png";
import Medal3 from "../../assets/medal_3.png";

// Define volunteer type
interface Volunteer {
  _id: string;
  username: string;
  hours: number;
}

// Image paths for podium medals (now using public directory)
const medalImages = [Medal1, Medal2, Medal3];

export default function Leaderboard() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch leaderboard data
    fetch("http://127.0.0.1:8000/get_leaderboard/")
      .then((res) => res.json())
      .then((data) => {
        // Sort users based on hours in descending order
        const sortedVolunteers = data.sort(
          (a: Volunteer, b: Volunteer) => b.hours - a.hours
        );
        setVolunteers(sortedVolunteers);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching leaderboard:", error));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-yellow-100 via-green-50 to-emerald-300 text-gray-900">
        {" "}
        {/* Added text-gray-900 */}
        <div
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative mt-16"
          style={{
            height: "75vh",
            display: "flex",
            justifyContent: "center",
            justifyItems: "center",
            alignSelf: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size="lg" color="success" />
        </div>
      </div>
    );

  return (
    <div className="mx-auto p-6 bg-gradient-to-br from-yellow-100 via-green-50 to-emerald-300 min-h-screen px-36">
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-700">
          Leaderboard
        </h2>

        {/* Top 3 Podium Display - Reordered with flex */}
        <div className="flex justify-center items-end gap-6 mb-12">
          {volunteers.slice(0, 3).map((volunteer, index) => (
            <div
              key={volunteer._id}
              className="flex flex-col items-center p-4 shadow-lg rounded-lg bg-white w-44 h-60"
              style={{
                // 1st place in center (order: 2), 2nd left (order: 1), 3rd right (order: 3)
                order: index === 0 ? 2 : index === 1 ? 1 : 3,
                // Adjust height for podium effect
                height: `${index === 0 ? 240 : 200}px`,
              }}
            >
              <Image
                src={medalImages[index]}
                alt={`Medal ${index + 1}`}
                width={52}
                height={52}
                className="mb-4 object-contain"
              />
              <h3 className="text-lg font-semibold text-gray-700">
                {volunteer.username}
              </h3>
              <p className="text-xl font-bold text-green-600">
                {volunteer.hours} Hours
              </p>
            </div>
          ))}
        </div>

        {/* Leaderboard Table (unchanged) */}
        <div className="shadow-lg rounded-lg p-6 bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2">
                <th className="p-3 text-gray-700">Rank</th>
                <th className="p-3 text-gray-700">Username</th>
                <th className="p-3 text-center text-gray-700">
                  Hours Volunteered
                </th>
              </tr>
            </thead>
            <tbody>
              {volunteers.slice(3).map((volunteer, index) => (
                <tr key={volunteer._id} className="border-b hover:bg-gray-100">
                  <td className="p-3 text-gray-700">{index + 4}</td>
                  <td className="p-3 font-semibold text-gray-500">
                    {volunteer.username}
                  </td>
                  <td className="p-3 text-center text-green-600 font-bold text-gray-700">
                    {volunteer.hours}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
