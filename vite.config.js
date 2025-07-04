export default {
	build: {
		outDir: 'dist',
		rollupOptions: {
			input: {
				main: './index.html',
				'src/notes': './src/notes.js',
				'styles/main.css': './styles/main.css',
			},
			output: {
				entryFileNames: '[name].js',
				assetFileNames: 'assets/[name][extname]',
			},
		},
	},
}
