d3.selection.prototype.moveToFront = function () {
  return this.each(function () {
    this.parentNode.appendChild(this);

    // the overlay should always stay on top
    const overlay = this.parentNode.querySelector("rect.interactions-overlay");
    this.parentNode.appendChild(overlay);
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

d3.tsv("data/state.tsv").then((data) => {
  let timeParse = d3.timeParse("%d-%b-%y");

  let states = new Set();

  for (let d of data) {
    d.Date = timeParse(d.Date);
    d.Value = +d.Value;
    states.add(d.Location); // push unique values to Set
  }

  const valuesByDate = {};
  data.forEach((d) => {
    if (!(d.Date in valuesByDate)) {
      valuesByDate[d.Date] = {};
    }
    valuesByDate[d.Date][d.Location] = d.Value;
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
  for (let state of states) {
    //.filter filters data in D3
    let stateData = data.filter((d) => d.Location === state);

    let g = svg2
      .append("g")
      .attr("class", "state")
      .attr("id", `state-${state}`);

    g.append("path")
      .datum(stateData) // datum is a single result from data
      .attr("stroke", "#ccc")
      .attr("d", line)
      .style("fill", "none");

    // find position of last piece to position end of line labels
    let lastEntry = stateData[stateData.length - 1];

    g.append("text")
      .text(state)
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

  const hoverLine = svg2
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
      const tooltipHtml = generateTooltip(
        formatDate((closestData ?? {}).Date),
        [
          {
            key: dropdown.value,
            value: formatPercent(
              valuesByDate[closestData.Date][dropdown.value]
            ),
            color: "steelblue",
          },
        ]
      );
      tooltip.html(tooltipHtml);

      const lineX = Math.max(margin2.left, xPosition);
      hoverLine.style("display", "block").attr("x1", lineX).attr("x2", lineX);
    }
  }

  function mouseover() {
    hoverLine.attr("opacity", "1");
    tooltip.style("display", null);
  }

  function mouseout() {
    hoverLine.attr("opacity", "0");
    tooltip.style("display", "none");
  }

  const interactionsOverlay = svg2
    .append("rect")
    .attr("class", "interactions-overlay")
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

const dropdown = document.getElementById("state-select");

function populateDropdown() {
  d3.tsv("data/state.tsv").then((data) => {
    const states = new Set();
    data.forEach((d) => {
      states.add(d.Location);
    });

    states.forEach((state) => {
      if (state === "DC") {
        addDropdownOption(state, true);
      } else {
        addDropdownOption(state);
      }
    });

    highlightLine();
  });
}

function addDropdownOption(value, isDefault = false) {
  const option = document.createElement("option");
  option.value = value;
  option.innerHTML = value;
  if (isDefault) {
    option.selected = true;
  }
  dropdown.appendChild(option);
}

dropdown.addEventListener("change", highlightLine);

function highlightLine() {
  const selected = dropdown.value;
  d3.selectAll(".highlight").classed("highlight", false);
  var sel = d3.select(`#state-${selected}`).classed("highlight", true);
  sel.moveToFront();
}

populateDropdown();
