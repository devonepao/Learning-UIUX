# Project Overview

This project is a mobile-first virtual wallet website that mimics the UI/UX of Samsung Wallet. It features a stack of cards that can be browsed using mouse scroll or touch gestures. The active card can be flipped to view its back.

**Main Technologies:**

*   **HTML:** The structure of the website is defined in `index.html`.
*   **CSS:** The styling and animations are handled by `style.css`.
*   **JavaScript:** The interactivity, including card browsing and flipping, is implemented in `script.js`.

**Architecture:**

The project follows a simple front-end architecture with three main files:

*   `index.html`: Contains the HTML structure of the wallet and cards.
*   `style.css`: Contains all the styles for the layout, cards, and animations.
*   `script.js`: Contains the JavaScript code for all the interactive features.

# Building and Running

This is a simple web project with no build process. To run the project, simply open the `index.html` file in a web browser.

# Development Conventions

*   **Coding Style:** The code follows standard HTML, CSS, and JavaScript conventions.
*   **Interactivity:** The card browsing is implemented using the `wheel` event for mouse and `touchstart`, `touchmove`, and `touchend` events for touch devices. A `throttle` function is used to limit the rate at which scroll and touch events are processed.
*   **Animations:** The card fanning and flipping animations are implemented using CSS transitions and transforms.
