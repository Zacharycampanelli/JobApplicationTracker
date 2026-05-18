import { useState, useMemo } from "react";

interface UseSearchProps<T> {
  /** The array of items to search through */
  items: T[] | undefined | null;
  /** The object keys of the items to match against the search query */
  searchKeys: (keyof T)[];
}

export function useSearch<T>({ items, searchKeys }: UseSearchProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    const safeItems = items || [];
    
    // If there's no search query, return all items
    if (!searchQuery.trim()) {
      return safeItems;
    }

    const query = searchQuery.toLowerCase();

    return safeItems.filter((item) => {
      // Return true if ANY of the specified searchKeys match the query
      return searchKeys.some((key) => {
        const value = item[key];
        
        // Skip null or undefined values
        if (value === null || value === undefined) return false;
        
        // Convert the value to a string and check if it includes the query
        return String(value).toLowerCase().includes(query);
      });
    });
  }, [items, searchQuery, searchKeys]);

  return {
    searchQuery,
    setSearchQuery,
    filteredItems,
  };
}
