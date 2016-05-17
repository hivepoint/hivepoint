Polymer({
  is: "main-app",
  
  properties: {
    vSize: Object
  },
  
  attached: function() {
    this.refreshLayout();
    
    window.addEventListener("resize", function() {
      if (!this._resizing) {
        this._resizing = true;
        this.async(function() {
          this.refreshLayout();
          this._resizing = false;
        }, 300);
      }
    }.bind(this));
  },
  
  refreshLayout: function() {
    var bch = Math.min(window.innerHeight * 0.65, 800);
    this.$.header.style.minHeight = bch + "px";
    this.async(function() {
      this.set("vSize", {
        width: this.$.header.offsetWidth,
        height: this.$.header.offsetHeight
      });
    }, 50);
  }
});