Polymer({
  is: "main-app",
  
  properties: {
    foo: String
  },
  
  attached: function() {
    this.set("foo", "Hello world");
  }
});