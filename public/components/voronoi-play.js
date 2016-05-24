Polymer({
  is: "voronoi-play",
  
  properties: {
    width: {
      type: Number,
      observer: 'refresh'
    },
    height: {
      type: Number,
      observer: 'refresh'
    }
  },
  
  attached: function() {
    this._attached = true;
    this.currentDragging = -1;
    this.refresh();
  },
  
  refresh: function() {
    var cellSize = 100;
    var cellRandomness = 200;
    this.userDragging =  false;
    if (this._attached && this.width && this.height) {
      this.compactMode = this.width <= 500;
      
      this.clearElement(this.$.container);
      this.svg = d3.select(this.$.container).append("svg")
                  .attr("width", this.width)
                  .attr("height", this.height)
                  .style("display", "block")
                  .style("overflow", "hidden");
      var hcount = Math.max(Math.floor(this.width / cellSize), 2);
      var vcount = Math.max(Math.floor(this.height / cellSize), 1);
      this.seeds = [];
      this.colors = [];
      for (var row = 0; row < vcount; row++) {
        for (var col = 0; col < hcount; col++) {
          var x = Math.min((Math.random() * cellRandomness) + ((cellSize - cellRandomness) / 2) + (col * cellSize), this.width - 1);
          var y = Math.min((Math.random() * cellRandomness) + ((cellSize - cellRandomness) / 2) + (row * cellSize), this.height - 1);
          this.seeds.push([x, y]);
          this.colors.push("rgba(0,0,0,0.2)");
        }
      }
      this.voronoi = d3.geom.voronoi();
      this.path = this.svg.append("g").selectAll("path");
      this.drag = d3.behavior.drag();
      this.drag.on("dragstart", function(d, i) {
        this.userDragging =  true;
        this.path.style("fill", function(d, i) {
          return this.colors[i];
        }.bind(this));
      }.bind(this));
      this.drag.on("drag", function(d, i) {
        this.seeds[i] = [d3.event.x, d3.event.y];
        this.currentDragging = i;
        this.userDragging =  true;
        this.redraw();
      }.bind(this));
      this.drag.on("dragend", function(d, i) {
        this.userDragging =  false;
        this.async(function() {
          this.startAnimation();
        }, 1000);
      }.bind(this));
      this.redraw();
      this.async(function() {
        this.startAnimation();
      }, 1000);
    }
  },
  
  polygon: function(d) {
    return "M" + d.join("L") + "Z";
  },
  
  redraw: function() {
    this.path = this.path.data(this.voronoi(this.seeds), function(d) {
      return this.polygon(d);
    }.bind(this));
    this.path.exit().remove();
    this.path.enter()
        .append("path")
        .attr("class", "vpath")
        .attr("id", function(d, i) { return "p" + i; })
        .attr("d", function(d) {
          return this.polygon(d);
        }.bind(this))
        .style("fill", function(d, i) {
          if (this.currentDragging == i) {
            return "rgba(255, 152, 0, 0.8)";
          }
          return this.colors[i];
        }.bind(this))
        .style("stroke", "rgba(255,255,255,0.7)")
        .style("stroke-width", "1px")
        .on("mouseover", function(d, i) {
          d3.select(event.target).style("fill", "rgba(255, 152, 0, 0.8)");
        })
        .on("mouseout", function(d, i) {
          d3.select(event.target).style("fill", this.colors[i]);
        }.bind(this))
        .call(this.drag);
    this.path.order();
  },
  
  clearElement: function(element) {
    if (element) {
      while (element.firstChild) {
        element.firstChild.remove();
      }
    }
  },
  
  startAnimation: function() {
    this.animationStart = null;
    var tick = function(timestamp) {
      if (this.userDragging) {
        return;
      }
      if (!this.animationStart) this.animationStart = timestamp;
      var progress = timestamp - this.animationStart;
      var pct = progress / (this.compactMode ? 3000 : 5000);
      if (pct >= 1) {
        this.async(function() {
          if (!this.userDragging) {
            this.startAnimation();
          }
        });
        return;
      } else {
        var x = this.animationSeedSrc[0] + ((this.animationSeedDst[0] - this.animationSeedSrc[0]) * pct);
        var y = this.animationSeedSrc[1] + ((this.animationSeedDst[1] - this.animationSeedSrc[1]) * pct);
        this.seeds[this.currentDragging] = [x, y];
        this.redraw();
        window.requestAnimationFrame(tick);
      }
    }.bind(this);
    if (this.currentDragging < 0) {
      this.currentDragging = Math.floor(Math.random() * this.seeds.length);
    }
    this.animationSeedSrc = [this.seeds[this.currentDragging][0], this.seeds[this.currentDragging][1]];
    this.animationSeedDst = [Math.floor(Math.random() * this.width), Math.floor(Math.random() * this.height)];
    window.requestAnimationFrame(tick);
    this.path.style("fill", function(d, i) {
      return this.colors[i];
    }.bind(this));
  }
});