import React, { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp, FaEdit, FaTrash, FaTrashAlt } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { BiPlus } from "react-icons/bi";
import {
  useGetItemsQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useUpdateSkillsOrderMutation,
} from "@/redux/api/skills-api";
import Layout from "@/layout/dashboard";

const SkillSort = () => {
  // Fetch skills from API
  const { data = { result: [] }, isFetching, error } = useGetItemsQuery({});
  const [createSkill] = useCreateMutation();
  const [updateSkill] = useUpdateMutation();
  const [deleteSkill] = useDeleteMutation();
  const [updateSkillsOrder] = useUpdateSkillsOrderMutation(); // New hook for updating skill order

  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState(skills);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [newSkill, setNewSkill] = useState({
    skill: "",
    subject: "",
    grade: "",
  });

  useEffect(() => {
    if (data) {
      setSkills(data);
      setFilteredSkills(data);
    }
  }, [data]);

  // Handle input change for editing or adding new skill
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSkill({ ...newSkill, [name]: value });
  };

  // Add new skill
  const addNewSkill = async () => {
    try {
      await createSkill(newSkill).unwrap();
      setIsAdding(false);
      setNewSkill({ skill: "", subject: "", grade: "" });
    } catch (error) {
      console.error("Failed to add skill", error);
    }
  };

  // Delete a skill
  const handleDeleteSkill = async (id) => {
    try {
      await deleteSkill(id).unwrap();
    } catch (error) {
      console.error("Failed to delete skill", error);
    }
  };

  // Edit a skill
  const editSkill = (skill) => {
    setEditingSkill(skill._id);
    setNewSkill({
      skill: skill.skill,
      subject: skill.subject,
      grade: skill.grade,
    });
    setIsEditing(true);
  };

  const saveEditedSkill = async () => {
    if (!editingSkill) {
      console.error("No skill selected for editing");
      return;
    }
    try {
      await updateSkill({ id: editingSkill, form: newSkill }).unwrap();
      setEditingSkill(null);
      setNewSkill({ skill: "", subject: "", grade: "" });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update skill", error);
    }
  };

  // Handle drag and drop
  const handleOnDragEnd = async (result) => {
    if (!result.destination) return;

    const reorderedSkills = Array.from(skills);
    const [reorderedItem] = reorderedSkills.splice(result.source.index, 1);
    reorderedSkills.splice(result.destination.index, 0, reorderedItem);

    setSkills(reorderedSkills);

    try {
      // Save reordered skills using the mutation hook
      await updateSkillsOrder(reorderedSkills).unwrap();
    } catch (error) {
      console.error("Failed to save reordered skills", error);
    }
  };

  const moveItem = (index, direction) => {
    const newSkills = [...filteredSkills];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= filteredSkills.length) return;

    // Swap items
    const temp = newSkills[index];
    newSkills[index] = newSkills[targetIndex];
    newSkills[targetIndex] = temp;
    setFilteredSkills(newSkills);
  };

  return (
    <div className="p-2">
      <div className="bg-white p-6 rounded shadow-md sm:min-w-[34rem]">
        {isFetching ? (
          <p>Loading skills...</p>
        ) : error ? (
          <p>Error loading skills: {error.message}</p>
        ) : (
          <>
            {/* Skill Filter */}
            <FilterSkills skills={skills} setFilteredSkills={setFilteredSkills} />
            {isEditing ? (
              <>
                <h2 className="text-xl font-semibold mb-4">Edit Skill</h2>
                <div className="mb-4">
                  <label className="block mb-2">Skill</label>
                  <input
                    type="text"
                    name="skill"
                    value={newSkill.skill}
                    onChange={handleInputChange}
                    className="border p-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={newSkill.subject}
                    onChange={handleInputChange}
                    className="border p-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Grade</label>
                  <input
                    type="text"
                    name="grade"
                    value={newSkill.grade}
                    onChange={handleInputChange}
                    className="border p-2 w-full"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={saveEditedSkill}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-300 text-black px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : isAdding ? (
              <>
                <h2 className="text-xl font-semibold mb-4">Add New Skill</h2>
                <div className="mb-4">
                  <label className="block mb-2">Skill</label>
                  <input
                    type="text"
                    name="skill"
                    value={newSkill.skill}
                    onChange={handleInputChange}
                    className="border p-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={newSkill.subject}
                    onChange={handleInputChange}
                    className="border p-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Grade</label>
                  <input
                    type="text"
                    name="grade"
                    value={newSkill.grade}
                    onChange={handleInputChange}
                    className="border p-2 w-full"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={addNewSkill}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Add Skill
                  </button>
                  <button
                    onClick={() => setIsAdding(false)}
                    className="bg-gray-300 text-black px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                  <Droppable droppableId="skills">
                    {(provided) => (
                      <table
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="w-full text-left border-collapse mb-4"
                      >
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="p-2 border">SKILLS</th>
                            <th className="p-2 border">SUBJECT</th>
                            <th className="p-2 border">GRADE</th>
                            <th className="p-2 border">ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredSkills.length > 0 &&
                            filteredSkills.map((skill, index) => (
                              <Draggable
                                key={skill._id}
                                draggableId={skill._id.toString()}
                                index={index}
                              >
                                {(provided) => (
                                  <tr
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="text-center"
                                  >
                                    <td className="p-2 text-left border">
                                      {skill.skill}
                                    </td>
                                    <td className="p-2 border text-left">
                                      {skill.subject}
                                    </td>
                                    <td className="p-2 border text-left">
                                      {skill.grade}
                                    </td>
                                    <td className="p-2 border flex items-center justify-center space-x-2">
                                      <div className="flex items-center">
                                        <FaArrowUp
                                          className="mr-1 text-gray-500 cursor-pointer"
                                          onClick={() => moveItem(index, -1)}
                                        />
                                        <FaArrowDown
                                          className="text-gray-500 cursor-pointer"
                                          onClick={() => moveItem(index, 1)}
                                        />
                                      </div>
                                      <button
                                        onClick={() => editSkill(skill)}
                                        className="text-blue-500"
                                      >
                                        <FaEdit />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteSkill(skill._id)}
                                        className="text-red-500"
                                      >
                                        <FaTrashAlt />
                                      </button>
                                    </td>
                                  </tr>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                        </tbody>
                      </table>
                    )}
                  </Droppable>
                </DragDropContext>
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsAdding(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Add New Skill
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};


SkillSort.Layout = Layout;
export default SkillSort;

const FilterSkills = ({ skills, setFilteredSkills }) => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Extract unique subjects from skills
    if (skills.length > 0) {
      const uniqueSubjects = [...new Set(skills.map((skill) => skill.subject))];
      setSubjects(uniqueSubjects);

      // Set the first subject as the default selected subject if available
      if (uniqueSubjects.length > 0) {
        setSelectedSubjects([uniqueSubjects[0]]);
      }
    }
  }, [skills]);

  useEffect(() => {
    // Filter skills based on selected subjects and search term
    if (skills.length > 0) {
      const filteredSkills = skills.filter(
        (skill) =>
          (selectedSubjects.length === 0 ||
            selectedSubjects.includes(skill.subject)) &&
          (searchTerm === "" ||
            skill.skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredSkills(filteredSkills);
    }
  }, [selectedSubjects, searchTerm, skills, setFilteredSkills]);

  const handleSubjectChange = (subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [subject]
    );
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="p-4 flex justify-between gap-1 items-center">
      {/* Buttons for filtering skills by subject */}
      <div className="flex flex-wrap gap-1">
        {subjects.map((subject) => (
          <button
            key={subject}
            onClick={() => handleSubjectChange(subject)}
            className={`p-2  ${
              selectedSubjects.includes(subject)
                ? "bg-blue-500 text-white"
                : "bg-blue-300 text-white"
            }`}
          >
            {subject}
          </button>
        ))}
      </div>
      {/* Search bar for filtering skills by name */}
      <div>
        <input
          type="text"
          value={searchTerm}
          placeholder="search..."
          onChange={handleSearchChange}
          className="border rounded p-1 input w-full"
        />
      </div>
    </div>
  );
};
