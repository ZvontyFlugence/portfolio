/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
			colors: {
				primary: '#0aff0a',
			},
			gridTemplateRows: {
				8: 'repeat(8, minmax(0, 1fr))',
			},
		},
	},
	plugins: [],
};
