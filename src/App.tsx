import React, { useState } from "react";
import Autocomplete from "./components/Autocomplete";

export default function App() {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const options = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Cherry", value: "cherry" },
    { label: "Grape", value: "grape" },
    { label: "Blueberry", value: "blueberry" },
  ];

  const getEmoji = (label: string) => {
    switch (label.toLowerCase()) {
      case "apple":
        return "🍎";
      case "banana":
        return "🍌";
      case "cherry":
        return "🍒";
      case "grape":
        return "🍇";
      case "blueberry":
        return "🫐";
      default:
        return ""; // Default emoji
    }
  };

  const renderOption = (option: string | { label: string; value: string }) => {
    return (
      getEmoji(typeof option === "string" ? option : option.label) +
      " " +
      (typeof option === "string" ? option : option.label)
    );
  };

  const handleRemove = (fruit: string) => {
    setSelectedValues(selectedValues.filter((item) => item !== fruit));
  };

  return (
    <div className="relative h-screen">
      <div className="absolute top-[30vh] left-1/2 transform -translate-x-1/2">
        <Autocomplete
          label="Multi-Select Fruits"
          options={options}
          value={selectedValues}
          onChange={(value) => setSelectedValues(Array.isArray(value) ? value : [value])}
          placeholder="Type to search..."
          description="Select one or more fruits from the dropdown."
          multiple={true}
          renderOption={renderOption}
        />
        <div className="mt-5">
          <h2 className="text-lg font-bold mb-3">Selected Fruits:</h2>
          <div className="flex flex-wrap gap-2">
            {selectedValues.map((fruit) => (
              <div
                key={fruit}
                className="flex items-center text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                <span className="mr-2">{getEmoji(fruit)}</span>
                <span>{fruit}</span>
                <button
                  onClick={() => handleRemove(fruit)}
                  className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}