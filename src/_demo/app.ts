import "../heading";
import "../input/number";
import "../code";

const headings = [
  `
<cx-heading>
  <h3>Default</h3>
</cx-heading>
`,
  `
<cx-heading>
  <span slot="prefix">😀</span>
  <h3>With prefix</h3>
</cx-heading>
`,
  `
<cx-heading>
  <h3>With suffix</h3>
  <span slot="suffix">😀</span>
</cx-heading>
`,
  `
<cx-heading>
  <h3>With padder</h3>
  <span slot="padder">😀</span>
</cx-heading>
`,
  `
<cx-heading>
  <h3>With subheading</h3>
  <div slot="subheading">
    subheading
  </div>
</cx-heading>
`,
  `
<cx-heading separator>
  <h3>With separator</h3>
</cx-heading>
`,
];

const renderHeadings = (h: string) => `
  <tr>
    <td>
      <cx-code>${h}</cx-code>
    </td>
    <td>
      ${h}
    </td>
  </tr>
`;

customElements.define(
  "cx-demo",
  class extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = `
        <cx-heading>
          <h1>Catalyx</h1>
        </cx-heading>

        <cx-heading>
          <h2>Headings</h2>
        </cx-heading>

        <table style="width: 100%;">
          <thead>
            <tr>
              <th>HTML</th>
              <th>Render</th>
            </tr>
          </thead>
          <tbody>
            ${headings.map(renderHeadings).join("")}
          </tbody>
        </table>

        <cx-heading>
          <h2>Inputs</h2>
        </cx-heading>

        <cx-input-number type="percent" currency="USD"></cx-input-number>
      `;
    }
  },
);
