export function createElement(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);
  for (const key in attributes) {
    if (key === "innerHTML") {
      element.innerHTML = attributes[key];
    } else {
      element.setAttribute(key, attributes[key]);
    }
    // if (attributes.hasOwnProperty(key)) {
    //   element.setAttribute(key, attributes[key]);
    // }
  }
  children.forEach((child) => {
    if (typeof child === "string") {
      append(element, document.createTextNode(child));
    } else {
      append(element, child);
    }
  });
  return element;
}

export function append(parent, child) {
  parent.appendChild(child);
}

export function remove(element) {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

export function loadCSS(file) {
  var link = createElement("link", {
    href: file,
    rel: "stylesheet",
    type: "text/css",
  });

  append(document.head, link);
}

class EventListener {
  // Create an empty object to store event listeners
  constructor() {
    this.events = {};
  }
  AddEvent(eventName, listener) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
  }

  // Method to emit (trigger) an event
  TriggerEvent(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((listener) => {
        listener(...args);
      });
    }
  }

  // Method to remove a specific listener from an event
  RemoveListener(eventName, listenerToRemove) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        (listener) => listener !== listenerToRemove
      );
    }
  }

  // Method to remove all listeners for a specific event
  removeAllListeners(eventName) {
    if (this.events[eventName]) {
      delete this.events[eventName];
    }
  }
}

export const Event = new EventListener();

export function addEventListenerToElement(element, eventName, callback) {
  element.addEventListener(eventName, (event) => {
    callback(event);
    Event.TriggerEvent(eventName); // Trigger your custom event after the callback
  });
}

export function addEventListener(eventName, listener) {
  Event.AddEvent(eventName, listener);
}

export function removeEventListener(eventName, listener) {
  Event.RemoveListener(eventName, listener);
}

export function removeAllEventListeners(eventName) {
  Event.removeAllListeners(eventName);
}

export class Router {
  constructor(routes) {
    // Initialize routes and set up event listeners
    this.routes = routes || {};
    this.currentRoute = null;

    // Set up event listener for 'popstate' event
    window.addEventListener("popstate", (event) => {
      this.handleRouteChange(window.location.pathname);
    });

    // Handle initial route
    this.handleRouteChange(window.location.pathname);
  }

  // Method to navigate to a specific route
  navigate(path) {
    // Use the HTML5 History API to navigate to the new route
    window.history.pushState(null, null, path);
    this.handleRouteChange(path);
  }

  // Method to handle route changes
  handleRouteChange() {
    const path = window.location.hash || "/";

    // const path = hash.split("#")[1] || "/";
    const routeHandler = this.routes[path] || this.routes["*"];
    if (routeHandler) {
      // Call the route handler function associated with the path
      routeHandler();
      this.currentRoute = path;
    } else {
      console.error(`No route found for ${path}`);
    }
  }
}

export class State {
  constructor(initialState) {
    this.state = initialState;
    this.onStateChange = null;
  }

  // Method to set the state and notify listeners
  setState(newState) {
    this.state = newState;
    if (typeof this.onStateChange === "function") {
      // Call the callback function when the state changes
      this.onStateChange(this.state);
    }
  }

  // Method to register a callback function to be triggered on state change
  setOnStateChange(callback) {
    this.onStateChange = callback;
  }
}
