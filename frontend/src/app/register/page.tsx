"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import Down from "@/assets/down.svg";
import { registerUser } from "@/api/register";

const causes = [
  "Advocacy & Human Rights",
  "Arts & Culture",
  "Board Development",
  "Children & Youth",
  "Community",
  "Computers & Technology",
  "Education & Literacy",
  "Environment",
  "Faith-Based",
  "Health & Medicine",
  "Homeless & Housing",
  "Hunger",
  "Immigrants & Refugees",
  "International",
  "Politics",
  "Seniors",
  "Sports & Recreation",
];

const skills = [
  "Administrative Support",
  "Adult Education",
  "Advertising",
  "Advocacy",
  "Basic Computer Skills",
  "Business Development",
  "Child Development",
  "Community Outreach",
  "Construction",
  "Critical Thinking",
  "Customer Service",
  "Delivery",
  "English as a Secondary Language (ESL)",
  "Event Management",
  "Food Delivery / Distribution",
  "Fundraising",
  "Graphic Design / Print",
  "Healthcare",
  "Home Repair",
  "Hospice Care",
  "Interior Design",
  "Journalism",
  "Landscaping",
  "Literacy / Reading",
  "Marketing & Communications (Mar/Com)",
  "Mechanical Engineering",
  "Mentoring",
  "Music Arts",
  "Networking",
  "Organization",
  "People Skills",
  "Photography",
  "Problem Solving",
  "Public Relations",
  "Public Speaking",
  "Reading / Writing",
  "Real Estate & Leasing",
  "Relationship Building",
  "Social Media / Blogging",
  "Special Needs",
  "STEM",
  "Strategic Planning",
  "System Engineering",
  "Transportation",
  "Tutoring",
  "Verbal / Written Communication",
  "Warehousing",
];

const groups = [
  "Kids",
  "Teens",
  "People 55+",
  "Public Groups",
  "Private Groups",
];

function MultiSelect({
  options,
  selected = [],
  onChange,
  placeholder,
}: {
  options: string[];
  selected?: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (option: string) => {
    const updatedSelection = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];
    onChange(updatedSelection);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="w-full p-2 border border-gray-300 rounded-md bg-white text-left flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate text-gray-700">
          {selected.length > 0 ? `${selected.length} selected` : placeholder}
        </span>
        <Image
          src={Down}
          alt="Down"
          width={16}
          height={16}
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option}
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => toggleOption(option)}
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => {}}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label className="ml-3 block text-sm text-gray-700">
                {option}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");

  const [selectedCauses, setSelectedCauses] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      email,
      first_name: firstName,
      last_name: lastName,
      username,
      password,
      location,
      causes: selectedCauses,
      skills: selectedSkills,
      groups: selectedGroups,
    };
    console.log("userData", userData);
    const result = await registerUser(userData);
    console.log(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-emerald-100 py-12 px-4 flex justify-center items-center">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Create your account
        </h2>
        <p className="text-gray-700 mb-8 text-center">
          Join our community of volunteers and start making a difference today.
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md text-black"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md text-black"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full p-2 border border-gray-300 rounded-md text-black"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md text-black"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full p-2 border border-gray-300 rounded-md text-black"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location
              </label>
              <input
                id="location"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md text-black"
                placeholder="Enter your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Causes you're interested in
            </label>
            <MultiSelect
              options={causes}
              selected={selectedCauses}
              onChange={setSelectedCauses}
              placeholder="Select causes..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills you can offer
            </label>
            <MultiSelect
              options={skills}
              selected={selectedSkills}
              onChange={setSelectedSkills}
              placeholder="Select skills..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Groups you'd like to work with
            </label>
            <MultiSelect
              options={groups}
              selected={selectedGroups}
              onChange={setSelectedGroups}
              placeholder="Select groups..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
