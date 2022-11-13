import React from "react"
import TogglerColor from "./TogglerColor"
import { Link } from "react-router-dom";

function Navbar() { 
	return (
		<>
			<nav className="w-full p-5 dark:bg-gray-900 bg-white md:flex md:items-center md:flex-row md:justify-between flex-col md:justify">
				<div>
					<span className="text-2xl font-bold dark:text-sky-400 font-Poppins cursor-pointer">TwitterClient</span>
				</div>
				<ul className="flex md:flex-row flex-col">
					<li className="mx-4 mt-6 md:my-0">
						<Link to='/' className="text-lg font-semibold dark:text-sky-400 hover:text-cyan-500 duration-500">Home</Link>
					</li>
					<li className="mx-4 mt-4 md:my-0">
						<Link to='/search/all' className="text-lg font-semibold dark:text-sky-400 hover:text-cyan-500 duration-500">Ricerca</Link>
					</li>
					<li className="mx-4 mt-4 md:my-0">
						<TogglerColor />
					</li>
				</ul>
			</nav>
		</>
		)
}

export default Navbar
