# GHTK Admin Frontend + Vuejs + Webpack

# <span class="docs-page-header-path">Docs v1.1.0  / </span> <span class="docs-page-header-dropdown"><span class="dropdown-toggle text-white">Vue.js</span> <span class="dropdown-menu mt-3">[<span class="d-inline-block py-1 px-2">HTML5</span>](html5.html) 

###### OTHER
[<span class="d-inline-block py-1 px-2">Settings panel</span>](settings-panel.html) [<span class="d-inline-block py-1 px-2">Layout helpers</span>](layout-helpers.html)</span></span>

<div class="docs-wrapper">

<div class="docs-sections bg-light">

*   [`vue-starter` directory structure](#directory-structure)
*   [Third-party components](#components)
*   [Installation](#installation)
*   <span>Page structure</span>
    *   [`index.html`](#page-structure-main)
    *   [Layouts](#page-structure-layouts)
    *   [Appwork's stylesheets](#page-structure-vendor-stylesheets)
    *   [Theming](#page-structure-theming)
    *   [Material styling](#page-structure-material)
    *   [RTL support](#page-structure-rtl)
    *   [Layout options](#page-structure-options)
    *   [Generator](#page-structure-generator)
*   [Available tasks](#tasks)

</div>

<div class="docs-inner">

<div class="docs-version">

<div class="docs-block text-white">Instructions can vary depending on whatever you use theme settings panel or not. Please select the appropriate version.</div>

*   [Without settings panel](#without-theme-settings)
*   [With settings panel](#with-theme-settings)

</div>

## <a name="directory-structure">`vue-starter` directory structure</a>

<div class="docs-block">

<div class="directory-structure">

<div class="file-item folder">

<div class="file-name">vue-starter</div>

<div>

<div class="file-item folder">

<div class="file-name">build</div>

<div>

<div class="file-item">

<div class="file-name">webpack.static.conf.js</div>

<div class="file-description">Appwork's stylesheets build config</div>

</div>

</div>

<div>

<div class="file-item">

<div class="file-name">...</div>

</div>

</div>

</div>

</div>

<div>

<div class="file-item folder">

<div class="file-name">config</div>

</div>

</div>

<div>

<div class="file-item folder">

<div class="file-name">src</div>

<div>

<div class="file-item folder">

<div class="file-name">assets</div>

</div>

</div>

<div>

<div class="file-item folder">

<div class="file-name">components</div>

</div>

</div>

<div>

<div class="file-item folder">

<div class="file-name">layout</div>

<div class="file-description">Page layouts</div>

<div>

<div class="file-item">

<div class="file-name">Layout1.vue</div>

</div>

</div>

<div>

<div class="file-item">

<div class="file-name">Layout1Flex.vue</div>

</div>

</div>

<div>

<div class="file-item">

<div class="file-name">...</div>

</div>

</div>

</div>

</div>

<div>

<div class="file-item folder">

<div class="file-name">router</div>

<div class="file-description">Router config</div>

</div>

</div>

<div>

<div class="file-item folder">

<div class="file-name">vendor</div>

<div class="file-description">Appwork's sources</div>

<div>

<div class="file-item folder">

<div class="file-name">libs</div>

<div class="file-description">Vue components</div>

<div>

<div class="file-item folder">

<div class="file-name">vue-color</div>

</div>

</div>

<div>

<div class="file-item folder">

<div class="file-name">vue-gallery</div>

</div>

</div>

<div>

<div class="file-item">

<div class="file-name">...</div>

</div>

</div>

</div>

</div>

<div>

<div class="file-item folder">

<div class="file-name">styles</div>

<div class="file-description">SCSS sources</div>

<div>

<div class="file-item folder">

<div class="file-name">_appwork</div>

<div class="file-description">Appwork includes</div>

</div>

</div>

<div>

<div class="file-item folder">

<div class="file-name">_custom-variables</div>

<div class="file-description">Custom variables</div>

</div>

</div>

<div>

<div class="file-item folder">

<div class="file-name">_theme</div>

<div class="file-description">Theme includes</div>

</div>

</div>

<div>

<div class="file-item folder">

<div class="file-name">_uikit</div>

<div class="file-description">UIKit includes</div>

</div>

</div>

<div>

<div class="file-item folder">

<div class="file-name">pages</div>

<div class="file-description">Page styles</div>

</div>

</div>

<div>

<div class="file-item folder">

<div class="file-name">rtl</div>

<div class="file-description">Styles with RTL support enabled</div>

</div>

</div>

<div>

<div class="file-item">

<div class="file-name">appwork.scss</div>

</div>

</div>

<div>

<div class="file-item">

<div class="file-name">appwork-material.scss</div>

</div>

</div>

<div>

<div class="file-item">

<div class="file-name">...</div>

</div>

</div>

</div>

</div>

</div>

</div>

<div>

<div class="file-item">

<div class="file-name">App.vue</div>

</div>

</div>

<div>

<div class="file-item">

<div class="file-name">globals.js</div>

<div class="file-description">Global properties and methods</div>

</div>

</div>

<div>

<div class="file-item">

<div class="file-name">...</div>

</div>

</div>

</div>

</div>

<div>

<div class="file-item folder">

<div class="file-name">static</div>

<div>

<div class="file-item folder">

<div class="file-name">vendor</div>

<div class="file-description">Appwork's static assets</div>

<div>

<div class="file-item folder">

<div class="file-name">fonts</div>

</div>

</div>

<div>

<div class="file-item folder">

<div class="file-name">js</div>

</div>

</div>

</div>

</div>

</div>

</div>

<div>

<div class="file-item folder">

<div class="file-name">test</div>

</div>

</div>

<div>

<div class="file-item">

<div class="file-name">index.html</div>

</div>

</div>

<div>

<div class="file-item">

<div class="file-name">package.json</div>

</div>

</div>

<div>

<div class="file-item">

<div class="file-name">...</div>

</div>

</div>

</div>

</div>

</div>

## <a name="components">Third-party components</a>

<div class="docs-block">

The starter project by default includes all third-party components.  
Optionally you can remove unwanted components to reduce bundle size and compile time:

1.  Remove unwanted packages from the `dependencies` section in the `package.json` file.
2.  Remove related directories within the `src/vendor/libs` directory.
3.  Remove related `@import`s and `@include`s in the `src/vendor/styles/_theme/_libs.scss` file.

</div>

<div class="docs-block">

For example, if you want to exclude `vue-multiselect` component, you will need to:

1.  Remove `vue-multiselect` dependency in the `package.json` file.
2.  Remove the `src/vendor/libs/vue-multiselect` directory.
3.  Remove `@import "~@/vendor/libs/vue-multiselect/mixins";`, `@include vue-multiselect-theme($background, $color);` and `@include material-vue-multiselect-theme($background, $color);` lines in the `src/vendor/styles/_theme/_libs.scss` file.

</div>

## <a name="installation">Installation</a>

##### Windows

<div class="docs-block">

1.  Download and install Node.js 8.x from [https://nodejs.org/en/](https://nodejs.org/en/).
2.  Download and install Git from [https://git-scm.com/downloads](https://git-scm.com/downloads).
3.  Download and install Yarn from [https://yarnpkg.com/en/docs/install](https://yarnpkg.com/en/docs/install).
4.  Logout from the system and login again.
5.  Launch `cmd.exe` as administrator and run command `npm install --add-python-to-path='true' --global --production windows-build-tools`.
6.  Logout from the system and login again.
7.  Open `cmd.exe`, go to the `angular-starter` directory and run command `yarn install`.

</div>

##### Ubuntu

<div class="docs-block">

1.  Upgrade system: `sudo apt-get update && sudo apt-get upgrade`.
2.  Install curl: `sudo apt-get install curl`.
3.  Install Node.js 8.x and build tools following instructions on [https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions).
4.  Install Git following instructions on [https://git-scm.com/download/linux](https://git-scm.com/download/linux).
5.  Install Yarn following instructions on [https://yarnpkg.com/en/docs/install#debian-stable](https://yarnpkg.com/en/docs/install#debian-stable).
6.  Open terminal, go to the `angular-starter` directory and run command `yarn install`.

</div>

##### Mac OS X

<div class="docs-block">

1.  Install Xcode from App Store. After installing, launch the Xcode, accept the license agreement and wait while components installed.
2.  Install Homebrew following instructions on [https://brew.sh](https://brew.sh).
3.  Download and install Node.js 8.x from [https://nodejs.org/en/](https://nodejs.org/en/).
4.  Download and install Git from [https://git-scm.com/downloads](https://git-scm.com/downloads).
5.  Install Yarn following instructions on [https://yarnpkg.com/en/docs/install](https://yarnpkg.com/en/docs/install).
6.  Open terminal, go to the `angular-starter` directory and run command `yarn install`.

</div>

## Page structure

<div class="docs-block">

<div class="alert alert-info">Instead of configuring the layout manually, you can use the [Starter template generator](#page-structure-generator). It will dramatically simplify the initial setup.</div>

</div>

#### <a name="page-structure-main">`index.html`</a>

<div class="docs-block">

<pre class="docs-code-path">index.html</pre>

    <!DOCTYPE html>

    <html lang="en" class="default-style">
      <head>
        <title>Vue Starter</title>

        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="IE=edge,chrome=1">
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
        <link rel="icon" type="image/x-icon" href="favicon.ico">

        <!-- Main font -->
        <link href="https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,500,500i,700,700i,900" rel="stylesheet">

        <!-- Icons. Uncomment required icon fonts -->
        <!-- <link rel="stylesheet" href="/static/vendor/fonts/fontawesome.css"> -->
        <link rel="stylesheet" href="/static/vendor/fonts/ionicons.css">
        <!-- <link rel="stylesheet" href="/static/vendor/fonts/linearicons.css"> -->
        <!-- <link rel="stylesheet" href="/static/vendor/fonts/open-iconic.css"> -->
        <!-- <link rel="stylesheet" href="/static/vendor/fonts/pe-icon-7-stroke.css"> -->

        <!-- Promises -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.4/bluebird.min.js"></script>

        <!-- Layout helpers -->
        <script src="/static/vendor/js/layout-helpers.js"></script>

      </head>
      <body>

        <div id="app"></div>

        <!-- built files will be auto injected -->
      </body>
    </html>

    <!DOCTYPE html>

    <html lang="en" class="default-style">
      <head>
        <title>Vue Starter</title>

        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="IE=edge,chrome=1">
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
        <link rel="icon" type="image/x-icon" href="favicon.ico">

        <!-- Main font -->
        <link href="https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,500,500i,700,700i,900" rel="stylesheet">

        <!-- Icons. Uncomment required icon fonts -->
        <!-- <link rel="stylesheet" href="/static/vendor/fonts/fontawesome.css"> -->
        <link rel="stylesheet" href="/static/vendor/fonts/ionicons.css">
        <!-- <link rel="stylesheet" href="/static/vendor/fonts/linearicons.css"> -->
        <!-- <link rel="stylesheet" href="/static/vendor/fonts/open-iconic.css"> -->
        <!-- <link rel="stylesheet" href="/static/vendor/fonts/pe-icon-7-stroke.css"> -->

        <!-- Core stylesheets -->
        <link rel="stylesheet" href="/static/vendor/styles/bootstrap.css" class="theme-settings-bootstrap-css">
        <link rel="stylesheet" href="/static/vendor/styles/appwork.css" class="theme-settings-appwork-css">
        <link rel="stylesheet" href="/static/vendor/styles/theme-corporate.css" class="theme-settings-theme-css">
        <link rel="stylesheet" href="/static/vendor/styles/colors.css" class="theme-settings-colors-css">
        <link rel="stylesheet" href="/static/vendor/styles/uikit.css">

        <!-- Promises -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.4/bluebird.min.js"></script>

        <!-- Layout helpers -->
        <script src="/static/vendor/js/layout-helpers.js"></script>

        <!-- Theme settings -->
        <script src="/static/vendor/js/theme-settings.js"></script>
        <script>
          window.themeSettings = new ThemeSettings({
            cssPath: '/static/vendor/styles/',
            themesPath: '/static/vendor/styles/'
          });
        </script>

      </head>
      <body>

        <div id="app"></div>

        <!-- built files will be auto injected -->
      </body>
    </html>

</div>

#### <a name="page-structure-layouts">Layouts</a>

<div class="docs-block">

To display a page with the selected layout just define the page component as a child of the layout component.

You can find navbar, sidenav and footer components in the `src/layout` directory.

*   [Layout 1](#page-structure-layouts-layout1)
*   [Layout 1 (Flex)](#page-structure-layouts-layout1-flex)
*   [Layout 2](#page-structure-layouts-layout2)
*   [Layout 2 (Flex)](#page-structure-layouts-layout2-flex)
*   [Without navbar](#page-structure-layouts-without-navbar)
*   [Without navbar (Flex)](#page-structure-layouts-without-navbar-flex)
*   [Without sidenav](#page-structure-layouts-without-sidenav)
*   [Horizontal sidenav](#page-structure-layouts-horizontal-sidenav)
*   [Blank](#page-structure-layouts-blank)

<div class="docs-nav-content d-block" id="page-structure-layouts-layout1">

<pre class="docs-code-path">src/router/index.js</pre>

    ...

    import Layout1 from '@/layout/Layout1'

    ...

    const router = new Router({
      ...

      routes: [{
        ...
      }, {
        path: '/page',
        component: Layout1,
        children: [{
          path: '',
          component: () => import('@/components/Page')
        }]
      }, {
        ...
      }]

      ...
    ];

</div>

<div class="docs-nav-content d-none" id="page-structure-layouts-layout1-flex">

<pre class="docs-code-path">src/router/index.js</pre>

    ...

    import Layout1Flex from '@/layout/Layout1Flex'

    ...

    const router = new Router({
      ...

      routes: [{
        ...
      }, {
        path: '/page',
        component: Layout1Flex,
        children: [{
          path: '',
          component: () => import('@/components/Page')
        }]
      }, {
        ...
      }]

      ...
    ];

</div>

<div class="docs-nav-content d-none" id="page-structure-layouts-layout2">

<pre class="docs-code-path">src/router/index.js</pre>

    ...

    import Layout2 from '@/layout/Layout2'

    ...

    const router = new Router({
      ...

      routes: [{
        ...
      }, {
        path: '/page',
        component: Layout2,
        children: [{
          path: '',
          component: () => import('@/components/Page')
        }]
      }, {
        ...
      }]

      ...
    ];

</div>

<div class="docs-nav-content d-none" id="page-structure-layouts-layout2-flex">

<pre class="docs-code-path">src/router/index.js</pre>

    ...

    import Layout2Flex from '@/layout/Layout2Flex'

    ...

    const router = new Router({
      ...

      routes: [{
        ...
      }, {
        path: '/page',
        component: Layout2Flex,
        children: [{
          path: '',
          component: () => import('@/components/Page')
        }]
      }, {
        ...
      }]

      ...
    ];

</div>

<div class="docs-nav-content d-none" id="page-structure-layouts-without-navbar">

<pre class="docs-code-path">src/router/index.js</pre>

    ...

    import LayoutWithoutNavbar from '@/layout/LayoutWithoutNavbar'

    ...

    const router = new Router({
      ...

      routes: [{
        ...
      }, {
        path: '/page',
        component: LayoutWithoutNavbar,
        children: [{
          path: '',
          component: () => import('@/components/Page')
        }]
      }, {
        ...
      }]

      ...
    ];

</div>

<div class="docs-nav-content d-none" id="page-structure-layouts-without-navbar-flex">

<pre class="docs-code-path">src/router/index.js</pre>

    ...

    import LayoutWithoutNavbarFlex from '@/layout/LayoutWithoutNavbarFlex'

    ...

    const router = new Router({
      ...

      routes: [{
        ...
      }, {
        path: '/page',
        component: LayoutWithoutNavbarFlex,
        children: [{
          path: '',
          component: () => import('@/components/Page')
        }]
      }, {
        ...
      }]

      ...
    ];

</div>

<div class="docs-nav-content d-none" id="page-structure-layouts-without-sidenav">

<pre class="docs-code-path">src/router/index.js</pre>

    ...

    import LayoutWithoutSidenav from '@/layout/LayoutWithoutSidenav'

    ...

    const router = new Router({
      ...

      routes: [{
        ...
      }, {
        path: '/page',
        component: LayoutWithoutSidenav,
        children: [{
          path: '',
          component: () => import('@/components/Page')
        }]
      }, {
        ...
      }]

      ...
    ];

</div>

<div class="docs-nav-content d-none" id="page-structure-layouts-horizontal-sidenav">

<pre class="docs-code-path">src/router/index.js</pre>

    ...

    import LayoutHorizontalSidenav from '@/layout/LayoutHorizontalSidenav'

    ...

    const router = new Router({
      ...

      routes: [{
        ...
      }, {
        path: '/page',
        component: LayoutHorizontalSidenav,
        children: [{
          path: '',
          component: () => import('@/components/Page')
        }]
      }, {
        ...
      }]

      ...
    ];

</div>

<div class="docs-nav-content d-none" id="page-structure-layouts-blank">

<pre class="docs-code-path">src/router/index.js</pre>

    ...

    import LayoutBlank from '@/layout/LayoutBlank'

    ...

    const router = new Router({
      ...

      routes: [{
        ...
      }, {
        path: '/page',
        component: LayoutBlank,
        children: [{
          path: '',
          component: () => import('@/components/Page')
        }]
      }, {
        ...
      }]

      ...
    ];

</div>

</div>

#### <a name="page-structure-vendor-stylesheets">Appwork's stylesheets</a>

<div class="docs-block docs-theme-settings-version">

To use settings panel, you need to enable Appwork's stylesheets compilation (use the [generator](#page-structure-generator) to see the example):

1.  Open `src/App.vue` file and remove all Appwork's SCSS imports.
2.  Open the `build/webpack.dev.conf.js` file and change `module.exports` assignment so that you return `Promise.all`:

        module.exports = Promise.all([
          new Promise((resolve, reject) => {
            ...
          }),
          require('./webpack.static.conf')
        ])

3.  Open the `build/webpack.prod.conf.js` file and change `module.exports` assignment to:

        module.exports = [webpackConfig, require('./webpack.static.conf')]

</div>

#### <a name="page-structure-theming">Theming</a>

<div class="docs-block docs-default-version">

To enable a theme, import theme SCSS file in the `src/App.vue` file.

<pre class="docs-code-path">src/App.vue</pre>

    <style src="@/vendor/styles/theme-air.scss" lang="scss"></style>

</div>

<div class="docs-block docs-theme-settings-version">

To enable a theme, include the required theme stylesheet from the `/static/vendor/styles/` path.

<pre class="docs-code-path">index.html</pre>

    <link rel="stylesheet" href="/static/vendor/styles/theme-air.css" class="theme-settings-theme-css">

</div>

#### <a name="page-structure-material">Material styling</a>

<div class="docs-block">

To enable material styling you need to:

1.  Set `material-style` class on the `<html>` element instead of `default-style`.

    <pre class="docs-code-path">index.html</pre>

        <html class="material-style">

2.  Add `-material` suffix to `bootstrap.scss`, `appwork.scss`, `theme-*.scss` and `colors.scss` imports in the `src/App.vue` file.

    <pre class="docs-code-path">src/App.vue</pre>

        <style src="@/vendor/styles/bootstrap-material.scss" lang="scss"></style>
        <style src="@/vendor/styles/appwork-material.scss" lang="scss"></style>
        <style src="@/vendor/styles/theme-corporate-material.scss" lang="scss"></style>
        <style src="@/vendor/styles/colors-material.scss" lang="scss"></style>

3.  Add `-material` suffix to `bootstrap`, `appwork`, `theme-*` and `colors` stylesheets.

    <pre class="docs-code-path">index.html</pre>

        <link rel="stylesheet" href="/static/vendor/styles/bootstrap-material.css" class="theme-settings-bootstrap-css">
        <link rel="stylesheet" href="/static/vendor/styles/appwork-material.css" class="theme-settings-appwork-css">
        <link rel="stylesheet" href="/static/vendor/styles/theme-corporate-material.css" class="theme-settings-theme-css">
        <link rel="stylesheet" href="/static/vendor/styles/colors-material.css" class="theme-settings-colors-css">

4.  Optionally you can enable material ripple. Just append `material-ripple.js` script to the `<head>` section and call `attachMaterialRippleOnLoad()` function.

    <pre class="docs-code-path">index.html</pre>

        <script src="/static/vendor/js/material-ripple.js"></script>
        <script>
          window.attachMaterialRippleOnLoad();
        </script>

5.  Optionally you can enable material ripple. Just append `material-ripple.js` script to the `<head>` section.

    <pre class="docs-code-path">index.html</pre>

        <script src="/static/vendor/js/material-ripple.js"></script>

</div>

#### <a name="page-structure-rtl">RTL support</a>

<div class="docs-block docs-default-version">

To enable RTL direction support, import Appwork's SCSS files from the `vendor/styles/rtl/` directory instead of `vendor/styles/`.

<pre class="docs-code-path">src/App.vue</pre>

    <style src="@/vendor/styles/rtl/bootstrap.scss" lang="scss"></style>
    <style src="@/vendor/styles/rtl/appwork.scss" lang="scss"></style>
    <style src="@/vendor/styles/rtl/theme-corporate.scss" lang="scss"></style>
    <style src="@/vendor/styles/rtl/colors.scss" lang="scss"></style>
    <style src="@/vendor/styles/rtl/uikit.scss" lang="scss"></style>

</div>

<div class="docs-block docs-theme-settings-version">

To enable RTL direction support, open `build/webpack.static.conf.js` file and edit paths to load Appwork's SCSS from the `src/vendor/styles/rtl/` directory instead of `src/vendor/styles/`.

<pre class="docs-code-path">build/webpack.static.conf.js</pre>

    ...

    const webpackConfig = {
      entry: {
        'bootstrap': './src/vendor/styles/rtl/bootstrap.scss',
        'bootstrap-material': './src/vendor/styles/rtl/bootstrap-material.scss',
        'appwork': './src/vendor/styles/rtl/appwork.scss',
        'appwork-material': './src/vendor/styles/rtl/appwork-material.scss',
        ...
      },
      ...
    }

    ...

</div>

#### <a name="page-structure-options">Layout options</a>

<div class="docs-block">

You can configure the initial layout by setting control classes to the `<html>` element.

<div class="alert alert-warning mb-3">After the initial layout setup the recommended way to control layout options is [layout helpers](layout-helpers.html), because the helpers do some extra work, such as: setting container paddings (when navbar is fixed), performing layout animations, setting correct sidenav state classes depending on screen size etc.</div>

<pre class="docs-code-path">index.html</pre>

    <html class="layout-fixed layout-collapsed">

</div>

<div class="docs-block">

<table class="table table-sm">

<thead>

<tr>

<th>Control class</th>

<th>Description</th>

</tr>

</thead>

<tbody>

<tr>

<td>`.layout-reversed`</td>

<td>Reverse layout direction without markup change.</td>

</tr>

<tr>

<td>`.layout-expanded`</td>

<td>Expand layout sidenav on small screens (< 992px).</td>

</tr>

<tr>

<td>`.layout-collapsed`</td>

<td>Collapse layout sidenav on large screens (>= 992px).</td>

</tr>

<tr>

<td>`.layout-offcanvas`</td>

<td>Make layout sidenav offcanvas.</td>

</tr>

<tr>

<td>`.layout-fixed`</td>

<td>Set layout position to fixed.</td>

</tr>

<tr>

<td>`.layout-fixed-offcanvas`</td>

<td>Set layout position to fixed with offcanvas sidenav.</td>

</tr>

<tr>

<td>`.layout-navbar-fixed`</td>

<td>Set layout navbar position to fixed.</td>

</tr>

<tr>

<td>`.layout-footer-fixed`</td>

<td>Set layout footer position to fixed.</td>

</tr>

</tbody>

</table>

</div>

#### <a name="page-structure-generator">Generator</a>

Use starter template generator to simplify the initial setup. Just replace a content of appropriate files with the generated code within the `vue-starter` directory.

<div class="text-right small font-weight-bold mb-1">[Open in new tab](generators/vue-starter-generator.html)</div>

<div class="docs-block"><iframe src="generators/vue-starter-generator.html" frameborder="0" style="width: 100%;height: 600px;"></iframe></div>

## <a name="tasks">Available tasks</a>

<div class="docs-block">

Open console/terminal, go to the `vue-starter` directory and run `npm run task_name`.

</div>

<div class="docs-block">

<table class="table table-sm">

<thead>

<tr>

<th>Task</th>

<th>Description</th>

</tr>

</thead>

<tbody>

<tr>

<td>`dev`</td>

<td>Run dev server.</td>

</tr>

<tr>

<td>`build`</td>

<td>Build for production. <span class="docs-theme-settings-version">Please note that output stylesheets within `static/vendor/styles/` directory will not have a hash in their filenames. So you will need to define caching strategy for these files by yourself.</span></td>

</tr>

<tr>

<td>`unit`</td>

<td>Run unit tests.</td>

</tr>

<tr>

<td>`e2e`</td>

<td>Run end-to-end tests.</td>

</tr>

<tr>

<td>`test`</td>

<td>Run unit and end-to-end tests.</td>

</tr>

<tr>

<td>`lint`</td>

<td>Run linting.</td>

</tr>

</tbody>

</table>

</div>

</div>

</div>
