const svg = d3
  .select("#chart2")
  .append("svg")
  .attr("viewBox", [0, 0, width2, height2]);

d3.csv("data/types.csv").then((data) => {
  let timeParse = d3.timeParse("%d-%b-%y");

  let countries = new Set();

  for (let d of data) {
    d.Date = timeParse(d.Date);
    d.Value = +d.Value;
    countries.add(d.Location); // push unique values to Set
  }

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
  svg
    .append("g")
    .attr("transform", `translate(${margin2.left},0)`)
    .attr("class", "y-axis")
    .call(
      d3
        .axisLeft(y)
        .tickSize(-innerWidth)
        .tickFormat(formatPercent)
    );

  // X Axis second because we want it to be placed on top
  svg
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

  const array = Array.from(countries);
  // looping through set
  for (let country of countries) {
    //.filter filters data in D3
    let countryData = data.filter((d) => d.Location === country);
    console.log(d3.schemeCategory10[array.indexOf(country)]);
    let g = svg.append("g").attr("class", "country");

    g.append("path")
      .datum(countryData) // datum is a single result from data
      .attr("fill", "none")
      .style("stroke", d3.schemeCategory10[array.indexOf(country)])
      .attr("d", line);

    // find position of last piece to position end of line labels
    let lastEntry = countryData[countryData.length - 1];

    g.append("text")
      .text(country)
      .attr("x", x(lastEntry.Date))
      .attr("y", y(lastEntry.Value))
      .attr("dx", "5px") // shifting attribute in svg
      .attr("dominant-baseline", "middle")
      .attr("fill", d3.schemeCategory10[array.indexOf(country)]);
  }

  svg
    .append("line")
    .style("stroke", "black")
    .style("stroke-opacity", 0.7)
    .style("stroke-dasharray", "5, 3")
    .style("stroke-width", "1px")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
    .attr("y1", 65)
    .attr("y2", 65);
});
