module.exports = function(grunt) {
	grunt.initConfig({
	     'copy': {
  	   dev: {
  	   	files: [
  	   	{
            expand: true,
            src: './images/*',
            dest: './dist/'
         },
         {
         	src: './index.html',
         	dest: './dist/index.html'         
         },
         {
         	src: './js/pixi.min.js',
         	dest: './dist//js/pixi.min.js'         
         }
         ]
  	   }
  	 },

		uglify: {
			options: {
				mangle: true,
				report: "gzip"
			},
			my_target: {
				files: [
				{
					'dist/js/bloxed.js': ['js/bloxed.js']
				},
				{
					'dist/js/levels.js': ['js/levels.js']
				}
				]
			}
		}

	});
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', ['uglify', 'copy']);
};
