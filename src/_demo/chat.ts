import {BehaviorSubject} from "rxjs";

import {WebComponent, CustomElement} from "../web-component";

declare global {
  interface Window {
    Peer: any;
  }
}

@CustomElement("demo-chat")
export class DemoChat extends WebComponent {
  conn?: any;

  id$ = new BehaviorSubject<string | null>(null);
  connected$ = new BehaviorSubject(false);
  msgs$ = new BehaviorSubject<string[]>([]);

  appendMsg(msg: string) {
    this.msgs$.next([...this.msgs$.value, msg]);
  }

  constructor() {
    super();

    const peer = new window.Peer();

    peer.on("open", (id: string) => this.id$.next(id));
    peer.on("connection", (conn: any) => {
      console.log("connection", conn);
      this.conn = conn;
      this.conn.on("data", this.appendMsg.bind(this));
      this.connected$.next(true);
    });

    this.find("#id").bind(this.id$);

    this.find("#connect-form")
      .bind(this.connected$, (connected, elem) => (elem.hidden = connected))
      .on("submit", evt => {
        evt.preventDefault();
        if (evt.target instanceof HTMLFormElement) {
          const data = new FormData(evt.target);
          this.conn = peer.connect(data.get("target-id"));

          this.conn.on("open", () => {
            console.log("open");
            this.conn.on("data", this.appendMsg.bind(this));
            this.connected$.next(true);
          });
        }
      });

    this.find("#chat-form")
      .bind(this.connected$, (connected, elem) => (elem.hidden = !connected))
      .on("submit", evt => {
        evt.preventDefault();
        if (evt.target instanceof HTMLFormElement) {
          const msg = new FormData(evt.target).get("msg");
          if (msg) {
            this.conn.send(msg);
            this.appendMsg(String(msg));
            const input = evt.target.elements.namedItem("msg");
            if (input instanceof HTMLInputElement) {
              input.value = "";
            }
          }
        }
      });

    this.find("#msgs").bind(this.msgs$, msg => `<div>${msg}</div>`);
  }

  render() {
    return `
      <form id="connect-form">
        <div>
          Your ID: <code id="id"></code>
        </div>
        <div>
          <input name="target-id" type="text">
          <button type="submit">Connect</button>
        </div>
      </form>
      <form id="chat-form">
        <input name="msg" type="text">
        <button type="submit">Send</button>
        <div id="msgs"></div>
      </form>
    `;
  }
}
