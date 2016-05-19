Polymer({
  is: "main-app",
  
  properties: {
    vSize: Object,
    customerProduct: Object,
    buttons: Array,
    sections: {
      type: Array,
      value: function() { return []; }
    }
  },
  
  ready: function() {
    this.customerProducts = [
      {name: "website", color: "#FFEB3B"},
      {name: "product demo", color: "#F8BBD0"},
      {name: "sales presentation", color: "#BBDEFB"},
      {name: "product interface", color: "#C5E1A5"},
    ];
    this.customerProductIndex = -1;
    
    this.sectionTypes = [
      {id: "what", text: "What is HivePoint?", color: "#E3F2FD", description: "We’re a small team of elite developers passionate about interactive user interfaces.  We're experts in rapid development of engaging, interactive, fully operational end-to-end user-facing systems."},
      {id: "ex1", text: "Give me an example", color: "#EFEBE9"},
      {id: "how", text: "How we work", color: "#FFEBDE", description: "You identify a user-facing system, start with something small.  We re-conceptulize and implement an interactive version."},
      {id: "contact", text: "Contact us", color: "#E8F5E9"},
      {id: "team", text: "Meet our team", color: "#ECEFF1", description: "This is our team"},
    ];
    this.sectionsShowing = [];
  },
  
  attached: function() {
    this.controls = {
      "contact": this.$.contactPanel,
      "ex1": this.$.lymePanel
    },
    
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
    
    this.refreshButtons();
    this.nextCustomerProduct();
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
  },
  
  nextCustomerProduct: function() {
    this.customerProductIndex++;
    if (this.customerProductIndex >= this.customerProducts.length) {
      this.customerProductIndex = 0;
    }
    this.set("customerProduct", this.customerProducts[this.customerProductIndex]);
    this.customStyle['--cp-background'] = this.customerProduct.color;
    this.updateStyles();
    this.async(function() {
      this.nextCustomerProduct();
    }, 3000);
  },
  
  refreshButtons: function() {
    var list = [];
    for (var i = 0; i < this.sectionTypes.length; i++) {
      var st = this.sectionTypes[i];
      if (this.sectionsShowing.indexOf(st.id) < 0) {
        list.push(st);
      }
      if (list.length == 2) {
        break;
      }
    }
    this.set("buttons", list);
    this.refreshSections();
  },
  
  refreshSections: function() {
    this.buttons.forEach(function(item) {
      this.push("sections", item);
    }.bind(this));
  },
  
  onButtonTap: function(event) {
    var item = event.model.item;
    var currentNode = null;
    this.buttons.forEach(function(d) {
      var node = Polymer.dom(this.$.sections).querySelector("#" + this.getSectionId(d.id));
      if (node) {
        if (d.id == item.id) {
          node.style.height = "auto";
          node.style.marginBottom = "40px";
          node.style.opacity = 1;
          currentNode = node;
        } else {
          Polymer.dom(this.$.sections).removeChild(node)
        }
      }
    }.bind(this));
    
    this.sectionsShowing.push(item.id);
    this.async(function() {
      this.refreshButtons();
      this.async(function() {
        if (currentNode) {
          this.scrollTo(currentNode);
        }
      }, 300);
    }, 100);
  },
  
  scrollTo: function(node) {
    var newTop = document.body.scrollTop + node.getBoundingClientRect().top;
    if (newTop != document.body.scrollTop) {
      this._scrollTo(newTop);
    }
  },
  
   _scrollTo: function(scrollTo) {
    var duration = 350;
    var end = +new Date() + duration;
    var finalScroll = scrollTo;
    var initial = document.body.scrollTop;
    var step = function() {
      var current = +new Date();
      var remaining = end - current;
      document.body.scrollTop = Math.min(initial +  ((finalScroll - initial) * (1 - remaining/duration)), finalScroll);
      if (remaining <= 0) {
        return;
      }
      window.requestAnimationFrame(step);
    }.bind(this);
    step();
  },
  
  getControl: function(id) {
    if (this.controls[id]) {
      return this.controls[id];
    }
    return null;
  },
  
  getSectionId: function(id) {
    return "section-" + id;
  }
});