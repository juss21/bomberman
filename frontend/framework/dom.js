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
