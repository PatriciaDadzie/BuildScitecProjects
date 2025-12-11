import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Specialties from '../components/Specialties'


const categories = [
'Accounting & Consulting','Admin Support','Customer Service','Data Science & Analytics','Design & Creative','Engineering & Architecture','IT & Networking','Legal','Sales & Marketing','Translation','Web, Mobile & Software Dev','Writing'
]


const designSpecialties = ['Art & Illustration','Audio & Music Production','Branding & Logo Design','NFT, AR/VR & Game Art','Graphic, Editorial & Presentation Design','Performing Arts','Photography','Product Design','Video & Animation']


export default function Home(){
const [active, setActive] = useState('Design & Creative')
const [selected, setSelected] = useState(['Branding & Logo Design','Graphic, Editorial & Presentation Design','Product Design'])


function toggle(item){
setSelected((s)=> s.includes(item) ? s.filter(x=>x!==item) : s.length<3 ? [...s,item] : s)
}


return (
<main className="min-h-screen p-12">
<div className="max-w-5xl mx-auto">
<h1 className="text-3xl font-semibold mb-6">Great, so what kind of work are you here to do?</h1>
<div className="flex gap-8">
<Sidebar categories={categories} active={active} onSelect={setActive} />
<div className="flex-1">
<Specialties items={designSpecialties} selected={selected} toggle={toggle} />
<div className="mt-8 flex justify-between">
<button className="px-4 py-2 border rounded">Back</button>
<button className="px-4 py-2 bg-green-600 text-white rounded">Next, add your skills</button>
</div>
</div>
</div>
</div>
</main>
)
}