// src/components/SearchInput.tsx
import React, { useState } from 'react';
import { SearchInputProps } from '../types/seaerch'; // Adjust path as needed

// A simple SVG for the search icon
const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-5 w-5 text-gray-500"
  >
    <path
      fillRule="evenodd"
      d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.61 4.61a.75.75 0 11-1.06 1.06l-4.6-4.6A8.25 8.25 0 012.25 10.5z"
      clipRule="evenodd"
    />
  </svg>
);

const SearchInput: React.FC<SearchInputProps> = ({
  searchFor,
  onChange,
  onSearch,
}) => {
  const [searchValue, setSearchValue] = useState('');

  const placeholderText = `search ${searchFor}`;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && onSearch) {
      onSearch(searchValue);
    }
  };

  return (
    <div className="flex items-center w-full max-w-xl mx-auto border border-gray-300 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="p-3">
        <SearchIcon />
      </div>
      <input
        type="text"
        placeholder={placeholderText}
        value={searchValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full py-2 pr-6 bg-transparent focus:outline-none text-lg text-gray-700 placeholder-gray-500"
        aria-label={placeholderText}
      />
    </div>
  );
};

export default SearchInput;