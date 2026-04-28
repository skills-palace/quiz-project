import { useGetItemsQuery } from "@/redux/api/skills-api";
import React, { useEffect, useState } from "react";
import Select from "react-select";

const skillsOptions = [
  { value: "criticalThinking", label: "Critical Thinking" },
  { value: "problemSolving", label: "Problem Solving" },
  { value: "creativity", label: "Creativity" },
  { value: "communication", label: "Communication" },
  { value: "collaboration", label: "Collaboration" },
  { value: "digitalLiteracy", label: "Digital Literacy" },
  { value: "empathy", label: "Empathy" },
  { value: "adaptability", label: "Adaptability" },
  { value: "leadership", label: "Leadership" },
  { value: "selfManagement", label: "Self-Management" },
];

const SkillSelect = ({ onChange, value }) => {
  const { data = { result: [] }, isFetching, error } = useGetItemsQuery({});

  const [skillsOptions, setSkillsOptions] = useState([]);

  useEffect(() => {
    if (data.length>0) {
      const mappedSkills = data?.map((skill) => ({
        value: skill._id,
        label: skill.skill,
      }));
      setSkillsOptions(mappedSkills);
      console.log(mappedSkills);
    }
  }, [data]); // add 'data' as dependency

  return (
    <div className="w-full max-w-sm">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Student Skills
      </label>
      <Select
        options={skillsOptions}
        className="react-select-container"
        classNamePrefix="react-select"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SkillSelect;
