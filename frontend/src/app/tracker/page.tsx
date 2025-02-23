"use client";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/joy/CircularProgress";

export type Opportunity = {
  causes: string[];
  description: string;
  goodFor: string[];
  id: string;
  location: string;
  missionStatement: string;
  organization: string;
  organizationDescription: string;
  skills: string[];
  title: string;
  url: string;
  hours: string;
  completed: boolean;
};

export default function Dashboard() {
  const [interestedOpportunities, setInterestedOpportunities] = useState<
    Opportunity[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail") || "";
    setEmail(storedEmail);

    const fetchData = async (userEmail: string) => {
      try {
        const encodedEmail = encodeURIComponent(userEmail);
        const response = await fetch(
          `http://127.0.0.1:8000/get_user/${encodedEmail}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const result = await response.json();
        setInterestedOpportunities(result.opportunities);
      } catch (error) {
        console.error(error);
        setError("Failed to load opportunities");
      } finally {
        setLoading(false);
      }
    };

    if (storedEmail) {
      fetchData(storedEmail);
    }
  }, []);

  async function addHours(id: string, hours: string) {
    try {
      const numericHours = parseInt(hours, 10) || 0;
      await fetch(
        `http://127.0.0.1:8000/update_hours/${encodeURIComponent(
          email
        )}?hours=${numericHours}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Error updating hours:", error);
    }
  }

  const handleComplete = async (id: string) => {
    const opportunity = interestedOpportunities.find((item) => item.id === id);
    if (opportunity) {
      try {
        await addHours(id, opportunity.hours);
        setInterestedOpportunities((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, completed: true } : item
          )
        );
      } catch (error) {
        console.error("Error completing opportunity:", error);
      }
    }
  };

  const handleHoursChange = (id: string, hours: string) => {
    setInterestedOpportunities((prev) =>
      prev.map((item) => (item.id === id ? { ...item, hours } : item))
    );
  };

  if (loading)
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-yellow-100 via-green-50 to-emerald-300 text-gray-900">
        {" "}
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
  if (error)
    return <div className="min-h-screen p-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-yellow-100 via-green-50 to-emerald-300 text-gray-900">
      {" "}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative mt-16">
        <div className="space-y-6 md:pr-12">
          <h2 className="text-lg font-semibold mb-6 text-gray-900">Active</h2>{" "}
          {interestedOpportunities
            .filter((item) => !item.completed)
            .map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-lg border bg-white shadow-md space-y-4"
              >
                <div>
                  <h3 className="font-medium text-lg text-gray-900">
                    {item.title}
                  </h3>{" "}
                  <p className="text-sm text-gray-700">{item.location}</p>{" "}
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Causes:</span>
                    <div className="flex flex-wrap gap-2">
                      {item.causes.map((cause, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700"
                        >
                          {cause}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32">
                      <input
                        id={`hours-${item.id}`}
                        type="number"
                        placeholder="Hours"
                        value={item.hours}
                        onChange={(e) =>
                          handleHoursChange(item.id, e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <button
                      onClick={() => handleComplete(item.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                    >
                      Complete
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="space-y-6 md:pl-12">
          <h2 className="text-lg font-semibold mb-6 text-gray-900">
            Completed
          </h2>{" "}
          {interestedOpportunities
            .filter((item) => item.completed)
            .map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-lg border bg-gray-50 space-y-4"
              >
                <div>
                  <h3 className="font-medium text-lg text-gray-900">
                    {item.title}
                  </h3>{" "}
                  <p className="text-sm text-gray-700">{item.location}</p>{" "}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Causes:</span>
                    <div className="flex flex-wrap gap-2">
                      {item.causes.map((cause, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700"
                        >
                          {cause}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Hours:</span>
                    <span className="text-sm">{item.hours}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
