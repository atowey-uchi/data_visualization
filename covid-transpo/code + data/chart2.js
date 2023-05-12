const svg = d3
  .select("#chart2")
  .append("svg")
  .attr("viewBox", [0, 0, width2, height2]);

d3.csv("data/types.csv").then((data) => {
  let timeParse = d3.timeParse("%d-%b-%y");
  let formatDate = d3.timeFormat("%b '%y");

  let countries = new Set();

  for (let d of data) {
    d.Date = timeParse(d.Date);
    d.Value = +d.Value;
    countries.add(d.Location); // push unique values to Set
  }

  const valuesByX = {};
  data.forEach((d) => {
    if (!(d.Date in valuesByX)) {
      valuesByX[d.Date] = {};
    }
    valuesByX[d.Date][d.Location] = d.Value;
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
  svg
    .append("g")
    .attr("transform", `translate(${margin2.left},0)`)
    .attr("class", "y-axis")
    .call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat(formatPercent));

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
      .style("stroke-dasharray", getLineType(country)) // Add this line
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

  const hoverLine = svg
    .append("line")
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("opacity", "0")
    .attr("y1", margin2.top)
    .attr("y2", height2 - margin2.top);

  const tooltip = d3.select("#tooltip");

  const tooltipText = tooltip.append("text");

  function mousemove(event) {
    const xPosition = d3.pointer(event)[0];
    const xValue = x.invert(xPosition);

    tooltip
      .style("display", "block")
      .style("left", `${event.pageX}px`)
      .style("top", `${event.pageY}px`);

    const bisectDate = d3.bisector((d) => d.Date).left;
    const bisectIndex = bisectDate(data, xValue, 1);
    const previousData = data[bisectIndex - 1];
    const currentData = data[bisectIndex];
    const closestData =
      currentData && xValue - previousData.Date < currentData.Date - xValue
        ? previousData
        : currentData;

    if (closestData) {
      const tooltipContent = Array.from(countries)
        .map((name) => {
          const value = valuesByX[closestData.Date][name] ?? "N/A";
          return {
            key: name,
            value,
            color: d3.schemeCategory10[Array.from(countries).indexOf(name)],
          };
        })
        .filter((content) => content !== "");

      const tooltipHtml = generateTooltip(
        formatDate((closestData ?? {}).Date),
        tooltipContent
      );
      tooltip.html(tooltipHtml);

      const lineX = Math.max(margin2.left, xPosition);
      hoverLine.style("display", "block").attr("x1", lineX).attr("x2", lineX);
    }
  }

  function getLineType(country) {
    const lineTypes = ["1, 1", "", "10, 3", "2, 2"];
    const index = Array.from(countries).indexOf(country) % lineTypes.length;
    return lineTypes[index];
  }

  function mouseover() {
    hoverLine.attr("opacity", "1");
    tooltip.style("display", null);
  }

  function mouseout() {
    hoverLine.attr("opacity", "0");
    tooltip.style("display", "none");
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

  const interactionsOverlay = svg
    .append("rect")
    .attr("pointer-events", "all")
    .attr("fill", "none")
    .attr("width", width2 - margin2.left - margin2.right)
    .attr("height", height2 - margin2.top - margin2.bottom)
    .attr("x", margin2.left)
    .attr("y", margin2.top)
    .on("mousemove", mousemove)
    .on("mouseover", mouseover)
    .on("mouseout", mouseout);
});
