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
