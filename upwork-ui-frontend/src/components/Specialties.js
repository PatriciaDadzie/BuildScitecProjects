export default function Specialties({ items, selected, toggle }) {
return (
<div>
<p className="mb-4 text-gray-600">Now, select 1 to 3 specialties</p>
<div className="grid gap-2 max-w-md">
{items.map((it) => (
<label key={it} className="flex items-center gap-3">
<input type="checkbox" checked={selected.includes(it)} onChange={() => toggle(it)} />
<span>{it}</span>
</label>
))}
</div>
</div>
)
}