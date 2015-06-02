module.exports = function(grunt) {
	grunt.initConfig({
	     'copy': {
  	   dev: {
  	   	files: [
  	   	{
            expand: true,
            src: './images/*',
            dest: './gh-pages/'
         },
         {
         	src: './index.html',
         	dest: './gh-pages/bloxed.html'         
         },
         {
         	src: './js/pixi.min.js',
         	dest: './gh-pages//js/pixi.min.js'         
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
					'gh-pages/js/bloxed.js': ['js/bloxed.js']
				},
				{
					'gh-pages/js/levels.js': ['js/levels.js']
				}
				]
			}
		}

	});
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', ['uglify', 'copy']);
};
