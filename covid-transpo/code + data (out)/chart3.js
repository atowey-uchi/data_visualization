var margin_area = { top: 40, right: 0, bottom: 30, left: 30 },
  width_area = 700 - margin_area.left - margin_area.right,
  height_area = 500 - margin_area.top - margin_area.bottom;

var parseDate = d3v3.time.format("%Y/%m/%d").parse;

var x = d3v3.time.scale().range([0, width_area]);

var y = d3v3.scale.linear().range([height_area, 0]);

var color = d3v3.scale
  .ordinal()
  .range(["#9ecae1", "#7fb3d5", "#609bc8", "#4172bc", "#08306b"]);

var xAxis = d3v3.svg
  .axis()
  .scale(x)
  .orient("bottom")
  .tickFormat(d3v3.time.format("%b '%y"));

var formatValue = d3v3.format(".2s");

var yAxis = d3v3.svg
  .axis()
  .scale(y)
  .orient("left")
  .tickFormat(function (d) {
    return formatValue(d).replace("G", "B");
  });
//.tickFormat(formatPercent);

var area = d3v3.svg
  .area()
  .x(function (d) {
    return x(d.date);
  })
  .y0(function (d) {
    return y(d.y0);
  })
  .y1(function (d) {
    return y(d.y0 + d.y);
  });

var stack = d3v3.layout.stack().values(function (d) {
  return d.values;
});

var svg_area = d3v3
  .select("#chart3")
  .append("svg")
  .attr("class", "area")
  .attr("width", width_area + margin_area.left + margin_area.right)
  .attr("height", height_area + margin_area.top + margin_area.bottom)
  .append("g")
  .attr(
    "transform",
    "translate(" + margin_area.left + "," + margin_area.top + ")"
  );

// Append tooltip div element
var tooltip = d3v3
  .select("#chart3")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

d3v3.csv("data/new_distance.csv", function (error, data) {
  color.domain(
    d3v3.keys(data[0]).filter(function (key) {
      return key !== "date";
    })
  );
  data.forEach(function (d) {
    d.date = parseDate(d.date);
  });

  var browsers = stack(
    color.domain().map(function (name) {
      return {
        name: name,
        values: data.map(function (d) {
          return { date: d.date, y: d[name] * 1 };
        }),
      };
    })
  );

  // Find the value of the day with highest total value
  var maxDateVal = d3v3.max(data, function (d) {
    var vals = d3v3.keys(d).map(function (key) {
      return key !== "date" ? d[key] : 0;
    });
    return d3v3.sum(vals);
  });

  // Set domains for axes
  x.domain(
    d3v3.extent(data, function (d) {
      return d.date;
    })
  );
  y.domain([0, maxDateVal]);

  var browser = svg_area
    .selectAll(".browser")
    .data(browsers)
    .enter()
    .append("g")
    .attr("class", "browser");

  browser
    .append("path")
    .attr("class", "area")
    .attr("d", function (d) {
      return area(d.values);
    })
    .style("fill", function (d) {
      return color(d.name);
    })
    .style("fill-opacity", 1) // Set the fill opacity for the patterns

    // Add patterns to the areas
    .style("fill", function (d, i) {
      if (i === 0 || i === 2) {
        return "url(#pattern-" + i + ")";
      } else {
        return color(d.name);
      }
    });

  browser
    .append("text")
    .datum(function (d) {
      return { name: d.name, value: d.values[d.values.length - 1] };
    })
    .attr("transform", function (d) {
      return (
        "translate(" +
        x(d.value.date) +
        "," +
        y(d.value.y0 + d.value.y / 2) +
        ")"
      );
    })
    .attr("x", 10)
    .attr("dy", "-2.05em")
    .style("font-size", "12px")
    .style("fill", function (d) {
      return color(d.name);
    })
    .text(function (d) {
      return d.name;
    });

  browser.on("mouseover", function (d) {
    var currentXValue = d.values[0].date;

    // Retrieve values for the current x-axis value
    var valuesForXValue = d.values.filter(function (value) {
      return value.date.getTime() === currentXValue.getTime();
    });

    // Show tooltip
    tooltip.style("opacity", 1);

    // Update tooltip position and content
    tooltip
      .style("left", d3v3.event.pageX + "px")
      .style("top", d3v3.event.pageY + "px")
      .html(
        "X Value: " +
          currentXValue.toDateString() +
          "<br/>Y Values:<br/>" +
          formatValues(valuesForXValue)
      );
  });

  browser.on("mouseout", function () {
    // Hide tooltip
    tooltip.style("opacity", 0);
  });

  function formatValues(values) {
    var formattedValues = values.map(function (value) {
      return "&bull; " + value.name + ": " + value.y;
    });
    return formattedValues.join("<br/>");
  }

  var verticalLine = svg_area
    .append("line")
    .attr("class", "vertical-line")
    .attr("y1", 0)
    .attr("y2", height_area);

  browser.on("mouseover", function (d) {
    var xValue = d.values[0].date;

    // Update position of the vertical line
    var xPos = x(xValue);
    verticalLine.attr("x1", xPos).attr("x2", xPos);

    // Retrieve values for the x-axis value
    var valuesForXValue = d.values.filter(function (value) {
      return value.date.getTime() === xValue.getTime();
    });

    // Show tooltip
    tooltip.style("opacity", 1);

    // Update tooltip position and content
    tooltip
      .style("left", d3v3.event.pageX + 10 + "px")
      .style("top", d3v3.event.pageY - 10 + "px")
      .html(
        "X Value: " +
          xValue.toDateString() +
          "<br/>Y Values:<br/>" +
          formatValues(valuesForXValue)
      );
  });
  browser.on("mouseout", function () {
    // Hide tooltip
    tooltip.style("opacity", 0);

    // Hide vertical line
    verticalLine.attr("x1", -1).attr("x2", -1);
  });

  svg_area
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height_area + ")")
    .call(xAxis);

  svg_area.append("g").attr("class", "y axis").call(yAxis);
});
