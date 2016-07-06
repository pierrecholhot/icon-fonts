
Font Icons Repo:
================
Host your project's font-icons in a separate repository to avoid having to DIFF binary files


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


## Use this repo

- Fork this repository

- Install <YOUR-FORK> using `bower` into your project (append the tag/version at the end of URL)  
	Example: `bower install https://github.com/<SOMEONE>/<WHATEVER-YOU-CALLED-THE-REPO>.git#0.0.92`

- `@import` the `scss/less/css` files from `bower_components`  
	Example: `import "./bower_components/<WHATEVER-YOU-CALLED-THE-REPO>/dist/styles/brand-icons.css"`

- Optionally `@import "./bower_components/<WHATEVER-YOU-CALLED-THE-REPO>/dist/styles/font-face.css"` for the font declaration.  
	Otherwise you will have to declare it yourself to point towards the fonts in bower_components

- Copy font-files using your builder  
	Example: `gulp.src('./bower_components/<WHATEVER-YOU-CALLED-THE-REPO>/dist/fonts/*').pipe(gulp.dest('./public'))`
