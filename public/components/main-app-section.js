Polymer({
  is: "main-app-section",
  
  properties: {
    item: {
      type: Object,
      observer: 'refresh'
    },
    control: Object
  },
  
  attached: function() {
    this._attached = true;
    this.refresh();
  },
  
  refresh: function() {
    if (this._attached && this.item) {
      this.compactMode = window.innerWidth <= 500;
      this.customStyle['--section-background'] = this.item.color;
      this.customStyle['--section-font-size'] = this.compactMode ? "16px" : "20px"
      this.updateStyles();
      
      if (this.control) {
        this.$.textPanel.style.display = "none";
        this.$.controlPanel.style.display = "";
        var parent = Polymer.dom(this.control).parentNode;
        if (parent) {
          Polymer.dom(parent).removeChild(this.control);
        }
        Polymer.dom(this.$.controlPanel).appendChild(this.control);
        this.control.style.display = "";
      }
      
      this.async(function() {
        this.$.content.style.height = this.$.innerContent.offsetHeight + "px";
        this.async(function() {
          this.$.content.style.height = "auto";
        }, 300);
      }, 150);
    }
  }
});