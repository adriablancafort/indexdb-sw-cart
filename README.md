# Ecommerce Cart Service Worker

This is a proof of concept Service Worker that intercepts all the requests of an ecommerce cart REST API and manages the cart by leveraging the IndexDB API. It is also capable of caching files (.html, .css, .js, fonts, and images).

## Advantages

- Page loads in >5ms even with a 1.6MB image!
- Reduces load on the REST API. None of the REST API requests reach the server if the Service Worker is successfully activated.
- Files are only loaded once, then they are cached and load instantaneously.
- Continues to operate offline.

## Technologies Used

Built with HTML, CSS, and vanilla JS. It is also a Progressive Web App (PWA) with offline support.
