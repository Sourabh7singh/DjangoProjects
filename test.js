const url = 'https://code-compiler10.p.rapidapi.com/';
const options = {
	method: 'POST',
	headers: {
		'x-rapidapi-key': '60a1c1fa81msh1f29217b7f63ed1p162587jsn075c6b1249eb',
		'x-rapidapi-host': 'code-compiler10.p.rapidapi.com',
		'Content-Type': 'application/json',
		'x-compile': 'rapidapi'
	},
	body: {
		langEnum: [
			'php',
			'python',
			'c',
			'c_cpp',
			'csharp',
			'kotlin',
			'golang',
			'r',
			'java',
			'typescript',
			'nodejs',
			'ruby',
			'perl',
			'swift',
			'fortran',
			'bash'
		],
		lang: 'python',
		code: 'print("Hello world")',
		input: ''
	}
};

async function run() {
try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}
}

run()