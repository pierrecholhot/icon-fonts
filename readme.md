
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
