
module.exports = function(grunt) {

	var sourceFiles = ['dev/src/engine.js','dev/src/world.js',
						'dev/src/stateManager.js','dev/src/states/*','dev/src/plane.js'];

	//config
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		sass : {
			dist : {
				options: {                       // Target options
					style: 'expanded'
				},
				files : {
				//	'game/index.css' : 'dev/styles/main.scss'
				}
			}
		},
		concat: {
			options : {
				stripBanners : true,
				banner : '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
					'<%= grunt.template.today("yyyy-mm-dd") %> */',
				separator : '\n'
			},
			dist : {
				src : sourceFiles,
				dest : 'game/scripts/script.js'
			}
		},
		uglify: {
		    my_target: {
				files: {
	//			'game/script.min.js': '<%= concat.dist.dest %>'
				}
		    }
		},
		'ftp-deploy' : {
			build : {
				auth : {
					host : 'ftp.anthonyladson.com',
					port : 21,
					authKey : "key1"
				},
				src : 'game',
		//		dest : 'quintessence',
				exclusions : ['.*']
			}
		}
	});

	//load task
	grunt.loadNpmTasks('grunt-contrib-sass')
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-ftp-deploy')

	//register task
	grunt.registerTask('default', ['sass','concat','uglify']);
	grunt.registerTask('css',['sass']);
	grunt.registerTask('deploy',['default','ftp-deploy']);

};