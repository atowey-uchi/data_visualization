const map_tooltip = d3
  .select("#map1")
  .append("div")
  .attr("class", "svg-tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden");

const map_height = 610,
  map_width = 975;

const map_svg = d3
  .select("#map1")
  .append("svg")
  .attr("viewBox", [0, 0, map_width, map_height]);

Promise.all([
  d3.csv("data/map_data/feb.csv"),
  d3.json("libs/counties-albers-10m.json"),
]).then(([data, us]) => {
  const dataById = {};

  for (let d of data) {
    d.rate = +d.rate;
    //making a lookup table from the array (unemployment data)
    dataById[d.id] = d;
  }

  const counties = topojson.feature(us, us.objects.counties);

  // Quantize evenly breakups domain into range buckets
  const color = d3
    .scaleQuantize()
    .domain([0.55, 0.9])
    .nice()
    .range(d3.schemeBlues[9]);

  const path = d3.geoPath();

  d3.select("#legend")
    .node()
    .appendChild(
      Legend(
        d3.scaleOrdinal(
          ["55%", "60", "65", "70", "75", "80", "85", "90%+"],
          d3.schemeBlues[8]
        ),
        { title: "Average Percent of Population Leaving the Home Daily (%)" }
      )
    );

  map_svg
    .append("g")
    .selectAll("path")
    .data(counties.features)
    .join("path")
    .attr("fill", (d) =>
      d.id in dataById ? color(dataById[d.id].rate) : "#ccc"
    )
    .attr("d", path)
    .on("mousemove", function(event, d) {
      let info = dataById[d.id];
      map_tooltip
        .style("visibility", "visible")
        .html(`${info.name}: ${info.rate.toFixed(2)}%`)
        .style("top", event.pageY - 10 + "px")
        .style("left", event.pageX + 10 + "px");
      d3.select(this).attr("fill", "goldenrod");
    })
    .on("mouseout", function() {
      map_tooltip.style("visibility", "hidden");
      d3.select(this).attr("fill", (d) =>
        d.id in dataById ? color(dataById[d.id].rate) : "#ccc"
      );
    });
});
