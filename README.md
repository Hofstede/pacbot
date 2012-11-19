# Pacman

---

**This is very much a work in progress, and not ready for production.**

---

Pacman is a fast static site generator, written in node.js,
built for large sites with many files.

While there are many static site generators, few are built to work with lots of files.
The main problem is in development mode, where many static site generators regenerate all files
when a single file changes. If you have a lot of files, this means waiting a few seconds
before you can see your changes in the browser.

Pacman has **no support for**:

* Blogging
* Feeds
* Page listing
* Markdown
* Other templating languages

Pacman **has support for**:

* Regenerating files on the fly.
* HTML microtemplates.
* Layouts and partials.
* Deploy via rsync.
* Staying out of your way.

Pacman has two distinct modes: dev mode and build mode.

* **In dev mode**, all files are served on the fly, without recompilation.
* **In build mode**, all files are processed and all assets are packed, producing a directory that can be uploaded
to your server.

---

### Install

To install pacman, use npm:

```
$ npm install pacman -g
```

### Setup

Pacman could be used in a directory with the following structure:

```
mysite/
    config.js        -- the pacman config file (more on this later)
    public/          -- the folder where the build-mode generated site is placed
    content/         -- the content for your site
        index.html   -- an index file for your site, along with any other file
        _partials/   -- a folder with all your partials
        _layouts/    -- a folder with all your layouts
```

* Pacman will generate content from the `content` directory,
* The resulting site will be placed in the `public` directory.
* You can change the names of these folders from the command line, or in the `config.js` file.
* Files or folders starting with `_` will not be processed into the `public` directory.
* Other than that, the names of the folders are not important in any way.

### Usage

Here is how to use Pacman from the command line:

```
Usage: pacman [options]

Options:

  -h, --help            output usage information
  -V, --version         output the version number

  -d, --dev             dev mode: serve content directly
  -p, --port <port>     specify a different server port (default 3000)

  -b, --build           build mode: build a complete version, with packed assets
  -s, --server          start a server from the target directory
  -r, --rsync <target>  rsync target dir to remote server or local dir

  --config <path>       change config file       (default ./config.js)
  --source <path>       change source directory  (default ./content)
  --target <path>       change target directory  (default ./public)
```

Here are some common use cases:

```
# Development mode: serve files directly from ./content
$ pacman -d

# Build mode: Process all files and assets into ./public
$ pacman -b

# Build and deploy: build site, and rsync changes to your remote server
$ pacman -b -r user@example.com:/path/to/document/root/

# Preview: serve the generated ./public directory locally
$ pacman -b -s
```

---

### Templates

Pacman uses JS microtemplates from Underscore.js to parse HTML-files.
For example, putting the following in your HTML-file will output the current Unix timestamp:

```
<%= (new Date()).getTime() %>
```

`<%= %>` is used for escaped content, and `<%- %>` is used to output unescaped content.
You also have a few helpers, most importantly `get(key)` and `set(key, value)` which can be used
to pass variables between files, partials and layouts.


### Partials

Partials are small bits of HTML that you need on more than one page. Render another HTML file
(most often from your `_partials` directory) by using the `render` helper:

```
<%= render("partial", "_partials/myFile.html") %>
```

Putting your partials in a folder starting with `_` ensures that they will not be copied
into the `public` folder by themselves, but only as part of other files.

### Layouts

Layouts are used to surround your HTML files with standard content, like the doctype, your menu and footer.
Place your layout in `_layouts/default.html`, and it will be used automatically.
In your layout, you have the variable `content`, which denotes where the main content should be placed:

```
<!doctype html>
<html>
<head>
    <title>My Site</title>
</head>
<body>
<div id="page">
    <%= content %>
</div>
</body>
</html>
```

You can use different layouts for different files. This is specified
in your `config.js` file (explained at the end of this readme):

```js
exports.config = {
  layouts: {
    "mypage.html": "_layouts/other.html"
  }
};
```

Create an object with your custom layouts, called `layouts`, where each key should be a
substring of the file path to match, and the value points to the layout file.


### Assets

Assets (for now, just JS and CSS files) are served as they are in dev mode, and concatenated and minified in build mode.
Which assets belong in which group is specified in the `config.js` file (see the next section).
To include your assets, use the `assets` helper, quite possibly in your layout file:

```
<!doctype html>
<html>
<head>
    <title>My Site</title>
    <%= assets("css", "group1") %>
</head>
<body>
<div id="page">
    <%= content %>
</div>
<%= assets("js", "group2") %>
</body>
</html>
```


### Config.js

Pacman will look for a `config.js` file in the directory in which it is run.
You can override where to look for the config with the `-c` command line flag.
The config is a valid node.js module. Here is an example:

```js
exports.config = {

  assets: {
    css: {
      group1: [
        "css/1.css",
        "css/2.css"
      ]
    },
    js: {
      group2: [
        "js/a.js",
        "js/b.js"
      ]
    },
  },

  helpers: {
    hello: function() {
      return "hello!";
    }
  }

};
```

The main purpose of the file is to specify assets (in order), any default command line flags,
and any custom HTML helper functions.

In this example, we have two types of assets (CSS and JS), which each have one group of assets.
If the order is not important, you can use folder names instead of filenames,
and each file in that directory will be included.
Each asset file path is sufficed with a `?v=<current_build_timestamp>` for proper cache busting.
You can disable this with the `config.timestamp` flag.

We have a helper function (`hello`), usable in any HTML file.
These assets can be referenced in an HTML file like this:

```
<%= assets("css", "group1") %>
<%= assets("js", "group2") %>

<%= hello() %>
```

There are many other config flags you may override. For now,
see the file `lib/config.js` for all these flags.

---

License: MIT (see LICENSE).