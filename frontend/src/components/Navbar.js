import React from "react"

function Navbar() { 
	return (
		<React.Fragment>
			<nav class="fixed w-full p-5 dark:bg-gray-400 bg-white md:flex md:items-center md:justify">
				<div>
					<span class="text-2xl font-Poppins cursor-pointer">navbar</span>
				</div>
				<ul class="md:flex md:items-center">
					<li class="mx-4 my-6 md:my-0">
					<a href="" class="text-xl hover:text-cyan-500 duration-500">HOME</a>
					</li>
					<li class="mx-4 my-6 md:my-0">
					<a href="" class="text-xl hover:text-cyan-500 duration-500">LINK1</a>
					</li>
					<li class="mx-4 my-6 md:my-0">
					<a href="" class="text-xl hover:text-cyan-500 duration-500">LINK2</a>
					</li>
					<li class="mx-4 my-6 md:my-0">
					<a href="" class="text-xl hover:text-cyan-500 duration-500">LINK3</a>
					</li>
					<button class="bg-cyan-400 text-white font-Poppins duration-500 px-6 py-2 mx-4 hover:bg-cyan-500 active:bg-cyan-900 rounded-lg">
					Bottone
					</button>
					<Cerca />
				</ul>
			</nav>
		</React.Fragment>
		)
}

function Cerca() {
	return (
		<div class="justify-end">
			<form class="flex items-center">
				<label for="simple-search" class="sr-only">Cerca</label>

				<input type="text" id="simple-search" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Cosa stai cercando?" required>
				</div>
				<button type="submit" class="inline-flex items-center py-2.5 px-3 ml-2 text-sm font-medium text-white bg-cyan-400 rounded-lg hover:bg-cyan-500 focus:ring-4 focus:outline-none focus:ring-cyan-300 active:bg-cyan-700">
				<svg aria-hidden="true" class="mr-2 -ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>Cerca
				</button>
			</form>
		</div>
	)
}

export default Navbar
