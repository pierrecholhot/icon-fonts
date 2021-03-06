
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

- Run `gulp icons` to generate the font files and CSS
	- leave empty or append `--add` when you have added icons
	- append `--edit` when you have edited icons
	- append `--delete` when you have deleted icons

- Run `gulp tag` to push a new tag to the remote repo


## Commands

### After you ADDed new icons

    gulp icons # or gulp icons --add

### After you EDITed existing icons

    gulp icons --edit

### After you DELETEd existing icons

    gulp icons --delete





## Example

We need to edit TEL.SVG and delete USER.SVG and then add a new icon called BRAND.SVG
**Note: When you have to EDIT and DELETE multiple icons, run the `gulp icons` command for each batch..**

### Solution

0. Edit TEL.SVG
0. Run `gulp icons --edit` to bump the minor version and commit/push
0. Delete USER.SVG
0. Run `gulp icons --delete` to bump the major version and commit/push
0. Add BRAND.SVG in `src/svg`
0. Run `gulp icons` to bump the patch version and commit/push
0. Finally _!important_ run `gulp tag` to generate a tag and push it
