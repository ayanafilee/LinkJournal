// src/types.ts or types.d.ts

/**
 * Props for the SearchInput component.
 */
export interface SearchInputProps {
  /** The specific item being searched (e.g., "journal", "article", "book"). */
  searchFor: string;
  /** Optional handler for when the search value changes. */
  onChange?: (value: string) => void;
  /** Optional handler for search submission (e.g., pressing Enter). */
  onSearch?: (value: string) => void;
}