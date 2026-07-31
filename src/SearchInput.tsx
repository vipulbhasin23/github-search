interface SearchInputProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export default function SearchInput({
  query,
  onQueryChange,
}: SearchInputProps) {
  return (
    <input
      type="text"
      value={query}
      onChange={(e) => onQueryChange(e.target.value)}
    />
  );
}
