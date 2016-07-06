
Font Icons Repo:
================
Host your project's font-icons in a separate repository to avoid having to DIFF binary files

## How to use this ?

- Fork this repository

- Install <YOUR-FORK> using `bower` into your project (append the tag/version at the end of URL)  

		bower install https://github.com/<YOU>/<YOUR-FORK>.git#0.0.92

- Import the preferred `scss/less/css` files from `bower_components`  

		import "./bower_components/<YOUR-FORK>/dist/styles/brand-icons.css"

- Optionally add the following line for the font declaration.	Otherwise you will have to declare it yourself and manually point towards the fonts in `bower_components`.  

		@import "./bower_components/<YOUR-FORK>/dist/styles/font-face.css"

- Copy font-files using your builder  

		gulp.src('./bower_components/<YOUR-FORK>/dist/fonts/*').pipe(gulp.dest('./public'))


## Add icons

### Export SVG from Illustrator

Save your file as SVG with the following settings:

- SVG Profiles: SVG 1.1
- Fonts Type: SVG
- Fonts Subsetting: None
- Options Image Location: Embed
- Advanced Options
	- CSS Properties: Presentation Attributes
	- Decimal Places: 1
	- Encoding: UTF-8
	- Output fewer elements: check
	- Leave the rest unchecked.

### Add the SVG file to this project

- Drop your SVG file into `src/svg`
- Run `gulp icons` to generate the font files and CSS then push a new tag to the remote repo
