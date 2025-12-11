export default function Sidebar({ categories, active, onSelect }) {
return (
<aside className="w-56 pr-8">
<ul>
{categories.map((c) => (
<li key={c} className={`py-2 ${c===active? 'text-green-600 font-semibold' : 'text-gray-800'}`}>
<button onClick={() => onSelect(c)}>{c}</button>
</li>
))}
</ul>
</aside>
)
}