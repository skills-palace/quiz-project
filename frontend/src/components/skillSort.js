import React, { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp, FaEdit, FaTrash } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { BiPlus } from "react-icons/bi";
import { useGetItemsQuery } from "@/redux/api/skills-api";

const SkillSort = ({ setSkillsFilter }) => {
  const { data = { result: [] }, isFetching } = useGetItemsQuery({});

  useEffect(() => {
    console.log(data);
  }, [data]);
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

  // Toggle modal for sorting skills
  const openSortModal = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    setIsAdding(false);
  };

  const closeSortModal = () => {
    setIsModalOpen(false);
  };

  // Handle input change for editing or adding new skill
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSkill({ ...newSkill, [name]: value });
  };

  // Add new skill
  const addNewSkill = () => {
    setSkills([
      ...skills,
      {
        ...newSkill,
        id: skills.length + 1,
        createdAt: new Date().toLocaleDateString(),
      },
    ]);
    setSkillsFilter(skills);
    setSkillsFilter(skills);
    setNewSkill({ skill: "", subject: "", grade: "" });
    setIsAdding(false); // Go back to list view
  };

  // Delete a skill
  const deleteSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // Edit a skill
  const editSkill = (index) => {
    setEditingSkill(index);

    setNewSkill({
      skill: skills[index].skill,
      subject: skills[index].subject,
      grade: skills[index].grade,
    });
    setIsEditing(true); // Switch to edit view
  };
  
  // Save reordered list to the database
  const handleSaveSkills = async () => {
    try {
      // Send reordered skills to your backend
      await axios.post('/api/save-skills', { skills }); // Change the URL to your actual API
      alert('Skills saved successfully!'); // You can replace this with your preferred notification UI
    } catch (error) {
      console.error('Failed to save skills:', error);
    }
  };
  // Save the edited skill
  const saveEditedSkill = () => {
    const updatedSkills = [...skills];
    updatedSkills[editingSkill] = {
      ...updatedSkills[editingSkill],
      ...newSkill,
    };
    setSkillsFilter(updatedSkills);
    setSkills(updatedSkills);
    setEditingSkill(null);
    setNewSkill({ skill: "", subject: "", grade: "" });
    setIsEditing(false); // Go back to list view
  };
  useEffect(() => {
    setSkillsFilter(filteredSkills);
  }, [filteredSkills]);
  // Handle drag and drop
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(skills);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSkills(items);
  };

  const moveItem = (index, direction) => {
    const newSkills = [...filteredSkills];
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= filteredSkills.length) {
      return; // Prevent out-of-bounds
    }

    // Swap items
    const temp = newSkills[index];
    newSkills[index] = newSkills[targetIndex];
    newSkills[targetIndex] = temp;

    setFilteredSkills(newSkills);
  };
  return (
    <div className="p-2">
      <div className="bg-white p-6 rounded shadow-md sm:min-w-[34rem]">
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
            {/* Skills Drag and Drop Area */}
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
                      {filteredSkills.map((skill, index) => (
                        <Draggable
                          key={skill.id}
                          draggableId={skill.id.toString()}
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
                                  <button
                                    onClick={() => moveItem(index, -1)} // Move up
                                    className="text-gray-500 hover:text-gray-600"
                                    disabled={index === 0} // Disable for first item
                                  >
                                    <FaArrowUp />
                                  </button>
                                  <button
                                    onClick={() => moveItem(index, 1)} // Move down
                                    className="text-gray-500 hover:text-gray-600"
                                    disabled={
                                      index === filteredSkills.length - 1
                                    } // Disable for last item
                                  >
                                    <FaArrowDown />
                                  </button>
                                </div>
                                <button
                                  onClick={() => editSkill(index)}
                                  className="text-gray-500"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => deleteSkill(index)}
                                  className="text-gray-600"
                                >
                                  <FaTrash />
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
            <button
              onClick={() => setIsAdding(true)}
              className="rounded-md bg-blue-500 p-2 text-white mb-4"
            >
              <BiPlus />
            </button>
            <div className="flex items-center justify-end mt-8">
              <button
                onClick={closeSortModal}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
              <button
                onClick={closeSortModal}
                className="bg-blue-500 ml-4 text-white px-4 py-2 rounded"
              >
                Save Skills
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SkillSort;

const FilterSkills = ({ skills, setFilteredSkills }) => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Extract unique subjects from skills
    const uniqueSubjects = [...new Set(skills.map((skill) => skill.subject))];
    setSubjects(uniqueSubjects);

    // Set the first subject as the default selected subject if available
    if (uniqueSubjects.length > 0) {
      setSelectedSubjects([uniqueSubjects[0]]);
    }
  }, [skills]);

  useEffect(() => {
    // Filter skills based on selected subjects and search term
    const filteredSkills = skills.filter(
      (skill) =>
        (selectedSubjects.length === 0 ||
          selectedSubjects.includes(skill.subject)) &&
        (searchTerm === "" ||
          skill.skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredSkills(filteredSkills);
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
