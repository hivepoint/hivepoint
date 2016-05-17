Polymer({
  is: "random-balls",
  
  properties: {
    width: {
      type: Number,
      value: 0,
      observer: 'reset'
    },
    height: {
      type: Number,
      value: 0,
      observer: 'reset'
    },
    count: {
      type: Number,
      value: 200
    },
    minRadius: {
      type: Number,
      value: 5
    },
    maxRadius: {
      type: Number,
      value: 20
    }
  },
  
  attached: function() {
    this.__attached = true;
    this.reset();
  },
  
  clearElement: function(element) {
    if (element) {
      while (element.firstChild) {
        element.firstChild.remove();
      }
    }
  },
  
  refresh: function() {
    this.set("width", this.offsetWidth);
    this.set("height", this.offsetHeight);
  },
  
  reset: function() {
    if (this.__attached && this.width && this.height) {
      this.clearElement(this.$.container);
      
      // init nodes
      var nodes = d3.range(this.count).map(function() { return {radius: (Math.random() * (this.maxRadius - this.minRadius)) + this.minRadius}; }.bind(this)),
          root = nodes[0],
          color = d3.scale.category10();
      root.radius = 200;
      root.fixed = true;
      
      // init force
      var force = d3.layout.force()
                  .gravity(0.05)
                  .charge(function(d, i) { return i ? 0 : -2000; })
                  .nodes(nodes)
                  .size([this.width, this.height]);
      force.start();
      
      // init canvas
      var svg = d3.select(this.$.container).append("svg")
                .attr("width", this.width)
                .attr("height", this.height)
                .style("overflow", "hidden");
                
      // draw stuff
      svg.selectAll("circle")
         .data(nodes.slice(1))
         .enter().append("circle")
         .attr("r", function(d) { return d.radius; })
         .style("fill", function(d, i) { return color(i % 3); });
         
      force.on("tick", function(e) {
        var q = d3.geom.quadtree(nodes),
            i = 0,
            n = nodes.length;
        while (++i < n) q.visit(this.collide(nodes[i]));
        svg.selectAll("circle")
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
      }.bind(this));
      
      svg.on("mousemove", function() {
        var p1 = d3.mouse(this);
        root.px = p1[0];
        root.py = p1[1];
        force.resume();
      });
    }
  },
  
  collide: function(node) {
    var r = node.radius + 16,
        nx1 = node.x - r,
        nx2 = node.x + r,
        ny1 = node.y - r,
        ny2 = node.y + r;
        
    return function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== node)) {
        var x = node.x - quad.point.x,
            y = node.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = node.radius + quad.point.radius;
        if (l < r) {
          l = (l - r) / l * .5;
          node.x -= x *= l;
          node.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    };
  }
    
});
