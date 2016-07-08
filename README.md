
Font Icons Repo:
================
Host your project's font-icons in a separate repository to avoid having to DIFF binary files when multiple developers are simultaneously working.

## How to use this ?

- Fork this repository

- Install your fork using `bower` into your project (append the tag/version at the end of URL)  

    cd my-work-project
    bower install --save https://github.com/<YOU>/<YOUR-FORK>.git#0.0.2

- Import the preferred `scss/less/css` files from `bower_components`  

    import "./bower_components/<YOUR-FORK>/dist/styles/brand-icons.scss"

- Optionally import the following file for the font declaration. Otherwise you will have to manually point towards the fonts in `bower_components`.  

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


## Commands

### When you ADD new icons

    gulp icons # or gulp icons --patch

### When you EDIT existing icons

    gulp icons --minor

### When you DELETE existing icons

    gulp icons --major
