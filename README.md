# SVG-icon [![Build Status](https://travis-ci.org/mattstyles/svg-icon.png?branch=master)](https://travis-ci.org/mattstyles/svg-icon)

> Simple and lightweight mini-library making SVG in the DOM easy peasy


## Getting Started

```
bower install --save svg-icon
```

Then just include the script,

```
<script src="SVG-icon.min.js"></script>
```

SVGIcon is a self-registering module, meaning that it will run automagically when included in the page and turn your html into svgs. The html you need looks like this:

```
<img class="icon" data-src="./assets/svg/afro.min.svg" alt="">
```

It needs the class of `icon` for the script to latch on to and it needs a path to grab the svg file from, apart from that _it just works_.

For a clearer picture either read the [code](https://github.com/mattstyles/svg-icon/tree/master/src) (there’s not much of it) or see the [examples](https://github.com/mattstyles/svg-icon/tree/master/examples).


## How Does It Work

SVG-Icon is designed to be as simple and unobtrusive as possible.

Take the following example of how to include an svg icon in your project:

```
<img class="icon" data-src="./assets/svg/menu.min.svg" alt="">
```

That’s all there is to it!

When you include the script in the page it waits until the DOM content is ready, then scans it looking for any element with a class of `icon` (plans are afoot to extend this requirement). When it finds an element, it reads the `data-src` and loads in an svg from that path. Although the above example is an `<img>` element, there is no restriction on the type of element and it often makes more sense to use a custom element, such a `<i>`.

It’ll strip any comments from whatever the path returns and then just parse for an opening and closing svg tag. At the moment one svg per file is recommended (feel free to minify with [svgo](https://github.com/svg/svgo) and add attribution comments if necessary).

It will also cache any icons in an effort to be responsible so feel free to include multiple identical icons.

You can specify a couple of other [parameters](#HTML-API) that allow you to mix things up a little but, at heart, this is a mini-library that fulfills a very specific purpose so it’ll remain lightweight. Whether you should be lazy-loading svgs at all is a separate concern.

You can also pass a couple of [options](#options) to the `SVGIcon` object as well, but, again, this is a lightweight library.


## HTML API

### identifier

```
class="icon"
```

At the moment each of your icons must start with the `icon` class. This may conflict with your existing CSS, but, at the moment, that’s the only way to hook into it.

### data-src

```
data-src="./path/to/your/svg"
```

The path to the svg to grab. If you’ve specified a `basePath` in the options then this will be relative to that, otherwise it’ll be relative to the html root.

### data-class

```
data-class="class-to-apply"
```

When the SVG is loaded the tag is currently obliterated so if you want a class on the SVG tag you’ll have to specify it here. Yes, this is pretty rubbish.

### data-onload

```
data-onload="myLibrary.functionToRun"
```

Want something to fire when the icon is loaded? Specify the function as a string here and SVG-Icon will try to find it and run it.


## Options

### selfRegister

```
SVGIcon({
  selfRegister: false
});
```

By default SVG-Icon will register and run itself and in most cases you’ll want your icons to be as immediately available as possible so just including the script in the page and having it run itself is convenient. However, should you need a little more control you can always stop it from self registering and handle loading those icons yourself.

_Note:_ There is currently no easy way for manually load each icon, although calling SVGIcon.inject( true ) will grab all the icons.

### basePath

```
SVGIcon({
  basePath: './assets/svg/'
});
```

Specify a path to load icons from. All `data-src` attributes will now be relative to this `basePath`. SVGIcon is smart enough to normalize paths so don’t worry about including or omitting the trailing slash.


## Examples

```
git clone git@github.com:mattstyles/svg-icon.git
npm install
grunt examples
```

This will load all dependencies, build the code and fire up the examples index page in your default browser. Enjoy the icony goodness.


## Dependencies and Backwards Compatibility

SVG-Icon provides a shim layer for both the [lodash](http://lodash.com/) and the [jquery](http://jquery.com/) functions that it uses but this shim layer is only tested against [evergreen browsers](http://tomdale.net/2013/05/evergreen-browsers/). If you want across-the-board compatibility then you’ll need to include and/or lodash/jquery, SVG-Icon will use them if they are available.


## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.  Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://www.gruntjs.com).

### To build your code

```
grunt build
```

or

```
grunt watch
```


### To unit test your code

Using PhantomJS (as Travis does):

```
grunt karma:build
```

Using multiple browsers:

```
grunt karma:all
```

For a reloading, watching variant using Chrome:

```
grunt karma:dev
```

Unit tests are not comprehensive yet so any PR’s will require a manual once-over using the examples.  Any new functionality should probably be accompanied with a new example.


## License

Licensed under MIT.

---

[@veryfizzyjelly](https://twitter.com/veryfizzyjelly)

