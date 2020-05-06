import "./number";

const inputs = [
  `
<cx-input-number></cx-input-number>
`,
];

const renderInputs = (input: string) => `
  <tr>
    <td>
      <cx-code>${input}</cx-code>
    </td>
    <td>
      ${input}
    </td>
  </tr>
`;

export default `
  <cx-heading>
    <h2>Inputs</h2>
  </cx-heading>

  <table style="width: 100%;">
    <thead>
      <tr>
        <th>HTML</th>
        <th>Render</th>
      </tr>
    </thead>
    <tbody>
      ${inputs.map(renderInputs).join("")}
    </tbody>
  </table>
`;
