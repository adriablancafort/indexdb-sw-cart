# Ecommerce Cart Service Worker

Proof of concept Service Worker that intercepts all the requests of an ecommerce cart REST API and manages the cart by leveraging the IndexDB Browser API. It is also capable of caching files (.html, .css, .js, fonts, and images).

## Advantages

- File loads in 3ms even with a 1.6MB image!
- Reduces load on the REST API. None of the REST API requests reach the server if the Service Worker is successfully activated.
- Files are only loaded once, then they are cached and load instantaneously.
- Network speed doesen't affect page load speed. With Slow 3G connection all the files load in 25ms!
  (For context: "The average web page load time is 2500ms seconds on desktop and 8600ms seconds on mobile" Source: https://www.tooltester.com/en/blog/website-loading-time-statistics/)
- Continues to operate offline.

[Service Worker IndexDB Cart](https://github.com/adriablancafort/indexdb-sw-cart/assets/76774853/569579ca-a588-4560-8820-933a15bfe59b)

## Technologies Used

Built with HTML, CSS, and vanilla JS. It is also a Progressive Web App (PWA) with offline support.
