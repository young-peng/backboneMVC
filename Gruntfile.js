module.exports = function (grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON("package.json"),
		uglify: {
		  options: {
		    compress: {
		      warnings: false
		    },
			  banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',//添加banner
		    mangle: true,
		    preserveComments: 'some'
		  },
			buildall: {//任务三：按原文件结构压缩js文件夹内所有JS文件
				files: [{
					expand:true,
					cwd:'js',//js目录下
					src:'**/*.js',//所有js文件
					dest : "min"
				}]
			},
		}
	});
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.registerTask("default",["uglify"]);
}; 