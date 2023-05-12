function generateTooltip(title, content) {
  const rows = [];
  content.forEach((rowContent) => {
    rows.push(`
            <tr>
                <td><span style="background-color: ${rowContent.color}; width: 8px; height: 8px; border-radius: 2px; display: block; margin-right: 4px;"></span></td>
                <td>${rowContent.key}</td>
                <td style="padding-left: 4px;">${rowContent.value}</td>
            <tr>
        `);
  });
  return `
        <table>
            <thead>
                <tr>
                    <th colspan="3" style="text-align: left;">${title}</th>
                <tr>
            </thead>
            <tbody>
                ${rows.join("")}
            </tbody>
        </table>
    `;
}
