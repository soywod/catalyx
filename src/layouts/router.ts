export class Link extends HTMLElement {
  private _url: string;

  public constructor() {
    super();
    this.attachShadow({mode: "open"}).append(document.createElement("slot"));
    this._url = this.getAttribute("to") || "/";
  }

  protected connectedCallback() {
    this.addEventListener("click", this._navigateTo);
  }

  protected disconnectedCallback() {
    this.removeEventListener("click", this._navigateTo);
  }

  private _navigateTo = (evt: MouseEvent | TouchEvent) => {
    evt.preventDefault();
    navigateTo(this._url);
  };
}

export class Route extends HTMLElement {
  //
}

export class Router extends HTMLElement {
  private static _instances: Router[] = [];
  public static renderAll = () => Router._instances.forEach(router => router._render());

  private _routes: HTMLElement[] = [];

  public constructor() {
    super();

    const slot = document.createElement("slot");
    this.attachShadow({mode: "open"}).append(slot);

    slot.assignedElements().forEach(elem => {
      if (elem instanceof HTMLElement) {
        this._routes.push(elem);
      }
    });

    this._render();
  }

  protected connectedCallback() {
    Router._instances.push(this);
    window.addEventListener("popstate", this._render);
  }

  protected disconnectedCallback() {
    Router._instances = Router._instances.filter(i => !i.isSameNode(this));
    window.removeEventListener("popstate", this._render);
  }

  private _render = () => {
    this._routes.reduce((routeFound, route) => {
      route.hidden = true;
      if (routeFound) return true;

      const pattern = route.getAttribute("pattern");
      if (!pattern || new RegExp(pattern).test(window.location.pathname)) {
        route.hidden = false;
        return true;
      } else {
        return false;
      }
    }, false);
  };
}

export function navigateTo(url: string) {
  window.history.pushState(undefined, "", url);
  Router.renderAll();
}

customElements.define("cx-link", Link);
customElements.define("cx-route", Route);
customElements.define("cx-router", Router);
