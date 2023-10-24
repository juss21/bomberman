## Mini-Framework Documentation: JS-DomRouterState

### Introduction

#### Mini-Framework is a lightweight JavaScript framework providing utilities for working with the Document Object Model (DOM), managing client-side routing, and handling application state. It consists of several modules: dom.js for DOM manipulation, router.js for client-side routing, events.js for custom event handling, and state.js for managing application state. This documentation will guide you through the usage and functionalities of these modules.

#### Installation

To use JS-DomRouterState in your project, you need to include the respective JavaScript files in your HTML file:

```
>   node run build
>   <script src="./dist/framework.js"/>
```

# Usage

## DOM Manipulation

`createElement(tag, attributes = {}, children = [])`  
Creates a new DOM element with the specified tag, attributes, and children. Returns the created element.

`append(parent, child)`  
Appends a child element to a parent element.

`remove(element)`  
Removes a specified element from its parent.

`loadCSS(file)`  
Loads an external CSS file and appends it to the document head.

### Client-Side Routing

`Router(routes)`  
Creates a new Router instance with specified routes. Handles client-side navigation using the HTML5 History API.

`routes`: An object mapping route paths to corresponding handler functions.
`navigate(path)`  
Navigates to a specific route using the HTML5 History API.

### Custom Event Handling

`event.AddEvent(eventName, listener)`  
Adds a listener function to a custom event.

`event.TriggerEvent(eventName, ...args)`  
Triggers a custom event with optional arguments.

`event.RemoveListener(eventName, listener)`  
Removes a specific listener from a custom event.

`event.removeAllListeners(eventName)`  
Removes all listeners for a specific custom event.

### Application State Management

`State(initialState)`  
Creates a new State instance with the specified initial state.

`setState(newState)`  
Sets the state and notifies listeners with the new state.

`setOnStateChange(callback)`  
Registers a callback function to be triggered on state change.

### API Reference

### `dom.js`

`createElement(tag, attributes = {}, children = [])`  
Creates a new DOM element with the specified tag, attributes, and children. Returns the created element.

`append(parent, child)`  
Appends a child element to a parent element.

`remove(element)`  
Removes a specified element from its parent.

`loadCSS(file)`  
Loads an external CSS file and appends it to the document head.

### `router.js`

`Router(routes)`  
Creates a new Router instance with specified routes.

`navigate(path)`  
Navigates to a specific route using the HTML5 History API.

`handleRouteChange()`  
Internal method to handle route changes based on window.location.hash.

### `events.js`

`event.AddEvent(eventName, listener)`  
Adds a listener function to a custom event.

`event.TriggerEvent(eventName, ...args)`  
Triggers a custom event with optional arguments.

`event.RemoveListener(eventName, listener)`
Removes a specific listener from a custom event.

`event.removeAllListeners(eventName)`  
Removes all listeners for a specific custom event.

### `state.js`

`State(initialState)`  
Creates a new State instance with the specified initial state.

`setState(newState)`  
Sets the state and notifies listeners with the new state.

`setOnStateChange(callback)`  
Registers a callback function to be triggered on state change.
