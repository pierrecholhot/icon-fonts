
Font Icons Repo:
================
Host your project's font-icons in a separate repo to avoid DIFFing binary files.


#### Develop

Drop your SVG file into `src/svg` and run `gulp icons`
to generate the font files and push a new tag to the remote repo.


#### Use

- `bower install` this repo in yours (append the tag/version at the end of URL)
- `@import` the `scss/less/css` files from `bower_components`
- copy font-files using your builder
- optionally `@import 'font-face.css'` for the font declaration,
  otherwise you will have to declare it yourself to point towards the fonts


#### Export SVG from Illustrator

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
