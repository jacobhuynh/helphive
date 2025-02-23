"use client"

import { useState } from "react"

interface TrackerItem {
  id: number
  title: string
  location: string
  causes: string
  hours: string
  completed: boolean
}

export default function Tracker() {
  const [items, setItems] = useState<TrackerItem[]>([
    {
      id: 1,
      title: "Community Garden",
      location: "Central Park",
      causes: "Environment",
      hours: "",
      completed: false,
    },
    {
      id: 2,
      title: "Food Bank",
      location: "Downtown",
      causes: "Hunger Relief",
      hours: "",
      completed: false,
    },
    {
      id: 3,
      title: "Animal Shelter",
      location: "West Side",
      causes: "Animal Welfare",
      hours: "",
      completed: false,
    },
  ])

  const handleComplete = (id: number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, completed: true } : item)))
  }

  const handleHoursChange = (id: number, hours: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, hours } : item)))
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-300" />

        <div className="space-y-6 md:pr-12">
          <h2 className="text-lg font-semibold mb-6">Active</h2>
          {items
            .filter((item) => !item.completed)
            .map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-lg border bg-white shadow-md"
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.location}</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Causes:</span>
                      <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                        {item.causes}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32">
                        <label htmlFor={`hours-${item.id}`} className="sr-only">
                          Hours
                        </label>
                        <input
                          id={`hours-${item.id}`}
                          type="number"
                          placeholder="Hours"
                          value={item.hours}
                          onChange={(e) => handleHoursChange(item.id, e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <button
                        onClick={() => handleComplete(item.id)}
                        className="ml-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                      >
                        Complete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="space-y-6 md:pl-12">
          <h2 className="text-lg font-semibold mb-6">Completed</h2>
          {items
            .filter((item) => item.completed)
            .map((item) => (
              <div key={item.id} className="p-6 rounded-lg border bg-gray-100">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg">{item.title}</h3>
                    <p className="text-sm">{item.location}</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Causes:</span>
                      <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                        {item.causes}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Hours:</span>
                      <span className="text-sm">{item.hours}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
