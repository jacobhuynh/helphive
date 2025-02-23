"use client";
import { useEffect, useState } from "react";

export type Opportunity = {
    id: string;
    metadata: {
        causes: string[];
        description: string;
        groups: string[];
        location: string;
        missionStatement: string;
        organization: string;
        organizationDescription: string;
        skills: string[];
        title: string;
        url: string;
    };
    score: number;
}

export default function Dashboard() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");

    useEffect(() => {
        const storedEmail = localStorage.getItem("userEmail") || "";
        setEmail(storedEmail);

        const fetchData = async (userEmail) => {
            try {
                const encodedEmail = encodeURIComponent(userEmail);
                console.log("Using email:", encodedEmail);
                const response = await fetch(
                    `http://127.0.0.1:8000/get_matches/${encodedEmail}`
                );
                if (!response.ok) throw new Error("Network response was not ok");
                const result = await response.json();
                console.log(result);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        // Use the storedEmail directly instead of state
        if (storedEmail) {
            fetchData(storedEmail);
        }
    }, []); // Empty dependency array

    return (
        <div>
            <h3>{email}</h3>
        </div>
    );
}