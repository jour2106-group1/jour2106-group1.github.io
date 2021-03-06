var data = [
    {
      name: "德國",
      values: [
        {date: "2010", price: "15.79"},
        {date: "2011", price: "14.6"},
        {date: "2012", price: "12.77"},
        {date: "2013", price: "10.58"},
        {date: "2014", price: "10.45"},
        {date: "2015", price: "10.87"},
        {date: "2016", price: "10.62"}
      ]
    },
    {
      name: "奧地利",
      values: [
        {date: "2010", price: "23.33"},
        {date: "2011", price: "24.4"},
        {date: "2012", price: "23.57"},
        {date: "2013", price: "24.47"},
        {date: "2014", price: "24.94"},
        {date: "2015", price: "24.12"},
        {date: "2016", price: "25.23"}
      ]
    }
  ];
  
  var width = 750;
  var height = 450;
  var margin = 50;
  var viewBox = "0 0 750 450";
  var duration = 250;
  
  var lineOpacity = "0.25";
  var lineOpacityHover = "0.85";
  var otherLinesOpacityHover = "0.1";
  var lineStroke = "5px";
  var lineStrokeHover = "10px";
  
  var circleOpacity = '0.85';
  var circleOpacityOnLineHover = "0.25"
  var circleRadius = 5;
  var circleRadiusHover = 9;
  
  
  /* Format Data */
  var parseDate = d3.timeParse("%Y");
  data.forEach(function(d) { 
    d.values.forEach(function(d) {
      d.date = parseDate(d.date);
      d.price = +d.price;    
    });
  });
  
  
  /* Scale */
  var xScale = d3.scaleTime()
    .domain(d3.extent(data[1].values, d => d.date))
    .range([0, width-margin]);
  
  var yScale = d3.scaleLinear()
    .domain([0, 5+d3.max(data[1].values, d => d.price)])
    .range([height-margin, 0]);
  
  var color = d3.scaleOrdinal(d3.schemeCategory10);
  
  /* Add SVG */
  var svg = d3.select("#chart").append("svg")
    .attr("width", (width+margin)+"px")
    .attr("height", (height+margin)+"px")
    .attr('viewBox', '0 0 ' + (width+margin) + ' ' + (height+margin))
    .append('g')
    .attr("transform", `translate(${margin}, ${margin})`);
  
  
  /* Add line into SVG */
  var line = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.price));
  
  let lines = svg.append('g')
    .attr('class', 'lines');
  
  lines.selectAll('.line-group')
    .data(data).enter()
    .append('g')
    .attr('class', 'line-group')  
    .on("mouseover", function(d, i) {
        svg.append("text")
          .attr("class", "title-text")
          .style("fill", color(i))        
          .text(d.name)
          .attr("text-anchor", "middle")
          .attr("x", (width-margin)/2)
          .attr("y", 150);
      })
    .on("mouseout", function(d) {
        svg.select(".title-text").remove();
      })
    .append('path')
    .attr('class', 'line')  
    .attr('d', d => line(d.values))
    .style('stroke', (d, i) => color(i))
    .style('opacity', lineOpacity)
    .on("mouseover", function(d) {
        d3.selectAll('.line')
                      .style('opacity', otherLinesOpacityHover);
        d3.selectAll('.circle')
                      .style('opacity', circleOpacityOnLineHover);
        d3.select(this)
          .style('opacity', lineOpacityHover)
          .style("stroke-width", lineStrokeHover)
          .style("cursor", "pointer");
      })
    .on("mouseout", function(d) {
        d3.selectAll(".line")
                      .style('opacity', lineOpacity);
        d3.selectAll('.circle')
                      .style('opacity', circleOpacity);
        d3.select(this)
          .style("stroke-width", lineStroke)
          .style("cursor", "none");
      });
  
  
  /* Add circles in the line */
  lines.selectAll("circle-group")
    .data(data).enter()
    .append("g")
    .style("fill", (d, i) => color(i))
    .selectAll("circle")
    .data(d => d.values).enter()
    .append("g")
    .attr("class", "circle")  
    .on("mouseover", function(d) {
        d3.select(this)     
          .style("cursor", "pointer")
          .append("text")
          .attr("class", "text")
          .text(`${d.price}`)
          .attr("x", d => xScale(d.date) + 5)
          .attr("y", d => yScale(d.price) - 10);
      })
    .on("mouseout", function(d) {
        d3.select(this)
          .style("cursor", "none")  
          .transition()
          .duration(duration)
          .selectAll(".text").remove();
      })
    .append("circle")
    .attr("cx", d => xScale(d.date))
    .attr("cy", d => yScale(d.price))
    .attr("r", circleRadius)
    .style('opacity', circleOpacity)
    .on("mouseover", function(d) {
          d3.select(this)
            .transition()
            .duration(duration)
            .attr("r", circleRadiusHover);
        })
      .on("mouseout", function(d) {
          d3.select(this) 
            .transition()
            .duration(duration)
            .attr("r", circleRadius);  
        });
  
  
  /* Add Axis into SVG */
  var xAxis = d3.axisBottom(xScale).ticks(5);
  var yAxis = d3.axisLeft(yScale).ticks(5);
  
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${height-margin})`)
    .call(xAxis);
  
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append('text')
    .attr("y", 15)
    .attr("transform", "rotate(-90)")
    .attr("fill", "#000")
    .text("每百萬人中器官捐贈者人數");

    svg.append("text")
    .attr("class", "title")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .text("奧地利與德國對比 －近年每百萬人中器官捐贈者人數")
