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
