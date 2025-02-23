"use client"
import { useEffect, useState } from "react"

// Define volunteer type
interface Volunteer {
  _id: string
  username: string
  hours: number
}

// Image mapping for podium medals
const medalImages = ["../assets/medal_1.png", "../assets/medal_2.png", "../assets/medal_3.png"]

export default function Leaderboard() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])

  useEffect(() => {
    // Fetch leaderboard data
    fetch("http://127.0.0.1:8000/get_leaderboard/")
      .then((res) => res.json())
      .then((data) => {
        // Sort users based on hours in descending order
        const sortedVolunteers = data.sort((a: Volunteer, b: Volunteer) => b.hours - a.hours)
        setVolunteers(sortedVolunteers)
      })
      .catch((error) => console.error("Error fetching leaderboard:", error))
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8">Leaderboard</h2>

      {/* Top 3 Podium Display */}
      <div className="flex justify-center gap-6 mb-12">
        {volunteers.slice(0, 3).map((volunteer, index) => (
          <div key={volunteer._id} className="flex flex-col items-center p-4 shadow-lg rounded-lg bg-white w-44 h-60">
            <img src={medalImages[index]} alt={`Medal ${index + 1}`} className="h-16 w-16 mb-4 object-contain" />
            <h3 className="text-lg font-semibold">{volunteer.username}</h3>
            <p className="text-xl font-bold text-green-600">{volunteer.hours} Hours</p>
          </div>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2">
              <th className="p-3">Rank</th>
              <th className="p-3">Username</th>
              <th className="p-3 text-center">Hours Volunteered</th>
            </tr>
          </thead>
          <tbody>
            {volunteers.slice(3).map((volunteer, index) => (
              <tr key={volunteer._id} className="border-b hover:bg-gray-100">
                <td className="p-3 text-gray-700">{index + 4}</td>
                <td className="p-3 font-semibold">{volunteer.username}</td>
                <td className="p-3 text-center text-green-600 font-bold">{volunteer.hours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
