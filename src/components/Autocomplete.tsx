import React, { useState, useEffect, useRef } from "react";

export default function Autocomplete({
  label,
  options,
  value,
  onChange,
  placeholder,
  description,
  disabled,
  filterOptions,
  multiple = false,
  onInputChange,
  renderOption,
  loading = false,
}: {
  label: string;
  options: string[] | { label: string; value: string }[];
  value: string[] | string;
  onChange: (value: string[] | string) => void;
  placeholder: string;
  description?: string;
  disabled?: boolean;
  filterOptions?: (
    options: string[] | { label: string; value: string }[],
    inputValue: string
  ) => string[] | { label: string; value: string }[];
  multiple?: boolean;
  onInputChange?: (inputValue: string) => void;
  renderOption?: (option: string | { label: string; value: string }) => React.ReactNode;
  loading?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: string) => {
    if (multiple) {
      if (Array.isArray(value) && !value.includes(option)) {
        onChange([...value, option]);
      } else if (Array.isArray(value)) {
        onChange(value.filter((item) => item !== option));
      }
    } else {
      onChange(option);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || loading || disabled) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex === filteredOptions.length - 1 ? 0 : prevIndex + 1
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex <= 0 ? filteredOptions.length - 1 : prevIndex - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        const selectedOption =
          typeof filteredOptions[highlightedIndex] === "string"
            ? filteredOptions[highlightedIndex]
            : filteredOptions[highlightedIndex].value;
        handleSelect(selectedOption);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const defaultFilter = (
    options: string[] | { label: string; value: string }[],
    inputValue: string
  ) => {
    if (typeof options[0] === "string") {
      return (options as string[]).filter((option) =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      );
    } else {
      return (options as { label: string; value: string }[]).filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    }
  };

  const filteredOptions = filterOptions
    ? filterOptions(options, inputValue)
    : defaultFilter(options, inputValue);

  return (
    <div className="relative w-96" ref={dropdownRef}>
      <label className={`block text-lg font-bold mb-3 ${disabled ? "text-gray-400" : "text-gray-700"}`}>
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            if (!disabled) {
              const newValue = e.target.value;
              setInputValue(newValue);
              setIsOpen(true);
              if (onInputChange) {
                onInputChange(newValue);
              }
            }
          }}
          placeholder={placeholder}
          className={`w-96 border rounded-md p-2 ${
            disabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "border-gray-300"
          }`}
          onFocus={() => !disabled && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          disabled={disabled || loading}
        />
        {loading && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      {description && (
        <p
          className={`text-sm mt-1 ${
            disabled ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {description}
        </p>
      )}
      {isOpen && !disabled && !loading && (
        <ul className="absolute bg-white border border-gray-300 mt-1 w-full rounded-md z-10">
          {filteredOptions.map((option, index) => {
            const displayLabel =
              typeof option === "string" ? option : option.label;
            const valueKey = typeof option === "string" ? option : option.value;

            return (
              <li
                key={valueKey}
                className={`text-black p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 ${
                  highlightedIndex === index ? "bg-gray-200" : ""
                }`}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => !disabled && handleSelect(valueKey)}
              >
                {multiple && (
                  <input
                    type="checkbox"
                    checked={Array.isArray(value) && value.includes(valueKey)}
                    onChange={() => handleSelect(valueKey)}
                    className="cursor-pointer"
                    disabled={disabled}
                  />
                )}
                <span
                  className={`cursor-pointer ${
                    disabled ? "text-gray-400" : "text-black"
                  }`}
                >
                  {renderOption ? renderOption(option) : displayLabel}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}