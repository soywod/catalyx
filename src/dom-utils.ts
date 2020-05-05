export function parseStyle(str: string) {
  const wrapper = document.createElement("style");
  wrapper.innerHTML = str;
  return wrapper;
}

export function parseTemplate(str: string) {
  const wrapper = document.createElement("template");
  wrapper.innerHTML = str;
  return wrapper.content;
}
