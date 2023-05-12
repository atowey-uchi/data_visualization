d3.selection.prototype.moveToFront = function () {
  return this.each(function () {
    this.parentNode.appendChild(this);
  });
};

let height2 = 500,
  width2 = 800,
  margin2 = { top: 25, right: 100, bottom: 35, left: 30 };
innerWidth = width2 - margin2.left - margin2.right;

const svg2 = d3
  .select("#chart")
  .append("svg")
  .attr("viewBox", [0, 0, width2, height2]);

let selectedCountry;

function updateVisualization() {
  d3.selectAll(".highlight").classed("highlight", false);
  d3.select(`.country[data-country="${selectedCountry}"]`).classed(
    "highlight",
    true
  );
  d3.select(`.country[data-country="${selectedCountry}"]`)
    .node()
    .parentNode.appendChild(
      d3.select(`.country[data-country="${selectedCountry}"]`).node()
    );
}

// Add an event listener to the dropdown select element

d3.tsv("data/state.tsv").then((data) => {
  let timeParse = d3.timeParse("%d-%b-%y");

  let countries = new Set();

  for (let d of data) {
    d.Date = timeParse(d.Date);
    d.Value = +d.Value;
    countries.add(d.Location); // push unique values to Set
  }

  const dropdown = document.getElementById("country-select");
  dropdown.addEventListener("change", function () {
    selectedCountry = dropdown.value;
    console.log("Selected country:", selectedCountry);
  });

  let x = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.Date))
    .range([margin2.left, width2 - margin2.right]);

  let y = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.Value))
    .nice() // using extent because values are less than 0
    .range([height2 - margin2.bottom, margin2.top]);

  var formatPercent = d3.format(".0%");

  // Y Axis first
  svg2
    .append("g")
    .attr("transform", `translate(${margin2.left},0)`)
    .attr("class", "y-axis")
    .call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat(formatPercent));

  // X Axis second because we want it to be placed on top
  svg2
    .append("g")
    .attr("transform", `translate(0,${height2 - margin2.top})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(d3.timeMonth.every(3))
        .tickFormat(d3.timeFormat("%b '%y"))
        .scale(x)
    );

  let line = d3
    .line()
    .x((d) => x(d.Date))
    .y((d) => y(d.Value));

  // looping through set
  for (let country of countries) {
    //.filter filters data in D3
    let countryData = data.filter((d) => d.Location === country);

    let g = svg2
      .append("g")
      .attr("class", "country")
      .on("mouseover", function () {
        // set/remove highlight class
        // highlight class defined in html
        d3.selectAll(".highlight").classed("highlight", false);
        var sel = d3.select(this).classed("highlight", true);
        sel.moveToFront();
      });

    // AZ selected in blue on load of page
    if (country === selectedCountry) {
      g.classed("highlight", true);
    }

    g.append("path")
      .datum(countryData) // datum is a single result from data
      .attr("stroke", "#ccc")
      .attr("d", line)
      .style("fill", "none");

    // find position of last piece to position end of line labels
    let lastEntry = countryData[countryData.length - 1];

    g.append("text")
      .text(country)
      .attr("x", x(lastEntry.Date))
      .attr("y", y(lastEntry.Value))
      .attr("dx", "5px") // shifting attribute in svg
      .attr("dominant-baseline", "middle")
      .attr("fill", "#ffffff");
  }

  svg2
    .append("line")
    .style("stroke", "black")
    .style("stroke-opacity", 0.7)
    .style("stroke-dasharray", "5, 3")
    .style("stroke-width", "1px")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
    .attr("y1", 318)
    .attr("y2", 318);

  let g = svg2
    .append("g")
    .attr("class", "country")
    .on("mouseover", function () {
      d3.selectAll(".highlight").classed("highlight", false);
      d3.select(this).classed("highlight", true);
      this.parentNode.appendChild(this);
    });
});
