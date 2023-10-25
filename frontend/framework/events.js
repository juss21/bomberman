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
