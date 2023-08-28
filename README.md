# @easrng/image-grid

a zero-dependency image grid web component

## installation

```sh
npm install @easrng/image-grid
```

## usage

```html
<easrng-image-grid>
  <div slot="extra">child that won't get included in the layout (put your buttons or whatever here)</div>
  <div data-width="16" data-height="9">16:9</div>
  <div data-width="4" data-height="3">4:3</div>
  <div data-width="1" data-height="1">1:1</div>
  <div data-width="1" data-height="2">1:2</div>
</easrng-image-grid>
```
