import { useState } from "react";
import { FiX, FiPlus } from "react-icons/fi"; // React Icons for "X" and "Plus"

const ImageSelector = ({ defaultImage, onImageChange }) => {
  const [imagePreview, setImagePreview] = useState(defaultImage || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImagePreview(imageURL);
      onImageChange(file); // Pass the selected file to the parent component
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    onImageChange(null); // Clear the image in the parent component
  };

  return (
    <div className="my-3">
      <label className="block text-sm font-medium mb-2 text-gray-700">
        Upload Image
      </label>

      {imagePreview ? (
        <div className="relative w-40 h-40 border rounded-lg overflow-hidden shadow-sm">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
            onClick={handleRemoveImage}
          >
            <FiX size={18} />
          </button>
        </div>
      ) : (
        <label
          htmlFor="image-upload"
          className="flex items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition"
        >
          <FiPlus size={24} className="text-gray-500" />
          <span className="sr-only">Upload Image</span>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};

export default ImageSelector;
