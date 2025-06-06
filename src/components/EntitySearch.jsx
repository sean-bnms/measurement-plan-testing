import { useState, useEffect } from "react";
import { Search } from "lucide-react"; // Optional icon library

export default function EntitySearch({
  title,
  placeholder,
  onSearch,
  delay = 300 // Debounce delay in ms
}) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(inputValue);
    }, delay);

    return () => clearTimeout(timeout); // Clear on unmount or when inputValue changes
  }, [inputValue, delay, onSearch]);

  return (
    <>
      <label htmlFor="search" className="block text-lg font-semibold mb-2">
        {title}
      </label>
      <div className="relative w-full mb-2">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-700 w-5 h-5 pointer-events-none" aria-label="hidden" />
        <input
          id="search"
          type="text"
          className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-white rounded-md text-sm shadow-2xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
    </>
  );
}
