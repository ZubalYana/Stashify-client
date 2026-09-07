import type Collection from "../../interfaces/collection";

interface CollectionPickerProps {
  collections: Collection[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

export default function CollectionPicker({
  collections,
  selectedIds,
  onChange,
}: CollectionPickerProps) {
  const toggle = (id: number) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id]
    );
  };

  if (collections.length === 0) {
    return <p className="text-white/25 text-xs">No collections yet.</p>;
  }

  return (
    <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto">
      {collections.map((c) => (
        <label
          key={c.id}
          className="flex items-center gap-2 bg-[#0d0d0d] border border-white/5 rounded-lg px-3 py-2 cursor-pointer hover:border-white/10 transition-colors"
        >
          <input
            type="checkbox"
            checked={selectedIds.includes(Number(c.id))}
            onChange={() => toggle(Number(c.id))}
            className="accent-[#F07020]"
          />
          <span className="text-white text-sm truncate">{c.name}</span>
        </label>
      ))}
    </div>
  );
}
