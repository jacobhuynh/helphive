"use client";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/joy/CircularProgress";

interface TagProps {
    text: string;
}

const Tag = ({ text }: TagProps) => (
    <span className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-green-100 text-gray-700 hover:bg-green-200 transition-colors">
        {text}
    </span>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline";
    size?: "default" | "sm" | "lg";
}

const Button = ({
    className,
    variant = "default",
    size = "default",
    ...props
}: ButtonProps) => {
    const baseStyles =
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";
    const variantStyles =
        variant === "outline"
            ? "border border-gray-300 bg-white hover:bg-gray-100 text-gray-700"
            : "bg-blue-600 hover:bg-blue-700 text-white";
    const sizeStyles =
        size === "sm" ? "h-9 px-3" : size === "lg" ? "h-11 px-8" : "h-10 px-4";

    return (
        <button
            className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
            {...props}
        />
    );
};

// Update the Card component
const Card = ({
    className = "",
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => (
    <div
        className={`rounded-lg border bg-white shadow-sm p-6 text-gray-900 ${className}`}
    >
        {children}
    </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-col space-y-1.5">{children}</div>
);

// Update the CardTitle component
const CardTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-semibold leading-none tracking-tight text-gray-900">
        {children}
    </h3>
);

const CardContent = ({
    className = "",
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;

export type Opportunity = {
    id: string;
    metadata: {
        causes: string[];
        description: string;
        goodFor: string[];
        location: string;
        missionStatement: string;
        organization: string;
        organizationDescription: string;
        skills: string[];
        title: string;
        url: string;
    };
    score: number;
};

export default function Dashboard() {
    const [reccommendedOpportunities, setReccommendedOpportunities] = useState<
        Opportunity[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [i, setI] = useState(0);

    const currentOpportunity = reccommendedOpportunities[i];

    useEffect(() => {
        const storedEmail = localStorage.getItem("userEmail") || "";
        setEmail(storedEmail);

        const fetchData = async (userEmail: string | number | boolean) => {
            try {
                const encodedEmail = encodeURIComponent(userEmail);
                console.log("Using email:", encodedEmail);
                const response = await fetch(
                    `http://127.0.0.1:8000/get_matches/${encodedEmail}`
                );
                if (!response.ok) throw new Error("Network response was not ok");
                const result = await response.json();
                console.log(result);
                // set state of opportunities
                setReccommendedOpportunities(result.matches);
            } catch (error) {
                console.log(error);
                setError("error");
            } finally {
                setLoading(false);
            }
        };

        // Use the storedEmail directly instead of state
        if (storedEmail) {
            fetchData(storedEmail);
        }
    }, []); // Empty dependency array

    async function userInterested(id: string) {
        console.log("User is interested in this opportunity", id);
        const encodedEmail = encodeURIComponent(email);

        try {
            await fetch(
                `http://127.0.0.1:8000/add_volunteering/${encodedEmail}?volunteer_id=${id}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                }
            );
        } catch (error) {
            console.error("Error saving interest:", error);
        }

        // Move to next opportunity using functional update
        setI((prev) => prev + 1);
    }

    function userNotInterested() {
        console.log("User is not interested in this opportunity");
        // Move to next opportunity using functional update
        setI((prev) => prev + 1);
    }

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
    if (error) return <div>Error loading recommendations: {error}</div>;
    if (!currentOpportunity) return <div>No more opportunities to show!</div>;

    return (
        <div className="bg-gradient-to-br from-yellow-100 via-green-50 to-emerald-300 text-gray-900 min-h-screen">
            <div className="container mx-auto p-4 md:p-6 lg:p-8">
                <div className="flex flex-col items-center space-y-6 mt-16">
                    <Card className="w-full max-w-3xl">
                        <CardHeader>
                            <div className="space-y-4">
                                <CardTitle>{currentOpportunity.metadata.title}</CardTitle>
                                <div className="text-base text-gray-700">
                                    {currentOpportunity.metadata.organization}
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <span className="h-7 w-4">📍</span>
                                    {currentOpportunity.metadata.location}
                                </div>
                            </div>
                        </CardHeader>
                        <div style={{ width: "100%", justifyContent: "center", justifySelf: "center", alignItems: "center" }} className="flex flex-col items-center gap-4">
                            <CircularProgress
                                variant="solid"
                                size="lg"
                                value={Math.round((currentOpportunity.score) * 100)}
                                determinate
                                sx={{
                                    "--CircularProgress-progressColor": "#22c55d",
                                    "--CircularProgress-trackColor": "#c5ecce",
                                }}
                            />
                            <p>
                                {Math.round((currentOpportunity.score) * 100)}% Match
                            </p>
                        </div>
                        <CardContent className="space-y-6 mt-4">
                            {/* ... rest of card content ... */}
                            <div className="space-y-2">
                                <h3 className="font-semibold">Description</h3>
                                <p className="text-gray-800">
                                    {currentOpportunity.metadata.description}
                                </p>
                            </div>

                            {/* Causes Section */}
                            <div className="space-y-2">
                                <h3 className="font-semibold">Causes</h3>
                                <div className="flex flex-wrap gap-2">
                                    {currentOpportunity.metadata.causes?.map((cause) => (
                                        <Tag key={cause} text={cause} />
                                    ))}
                                </div>
                            </div>

                            {/* Groups Section */}
                            <div className="space-y-2">
                                <h3 className="font-semibold">Groups</h3>
                                <div className="flex flex-wrap gap-2">
                                    {currentOpportunity.metadata.goodFor?.map((group) => (
                                        <Tag key={group} text={group} />
                                    ))}
                                </div>
                            </div>

                            {/* Skills Section */}
                            <div className="space-y-2">
                                <h3 className="font-semibold">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {currentOpportunity.metadata.skills?.map((skill) => (
                                        <Tag key={skill} text={skill} />
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-between gap-6 w-full max-w-3xl">
                        <Button
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3"
                            onClick={userNotInterested}
                        >
                            Not Interested
                        </Button>
                        <Button
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3"
                            onClick={() => userInterested(currentOpportunity.id)}
                        >
                            Interested
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
