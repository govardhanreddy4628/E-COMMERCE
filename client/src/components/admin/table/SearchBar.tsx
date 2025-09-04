import React from "react";
import { IoMdSearch } from "react-icons/io";

interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, placeholder = "Search customer" }) => {
    return (
    <div className="w-full md:w-1/3 flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
        <IoMdSearch className="text-gray-500 dark:text-gray-400 text-xl" aria-hidden="true" />
        <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            aria-label="Search customers"
        />
    </div>
  );
};

export default SearchBar;
