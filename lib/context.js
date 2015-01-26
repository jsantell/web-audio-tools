var util = require("util");
var EventEmitter = require("events").EventEmitter;
var RENDER_EVENTS = [
  "create-node", "disconnect-node", "connect-node", "connect-param"
];
var ARROW_HEIGHT = 5;
var ARROW_WIDTH = 8;

module.exports = ContextView;

function ContextView (core, nodes, el) {
  var view = this;
  this.el = el;
  this.nodes = nodes;
  this.render = this.render.bind(this);
  RENDER_EVENTS.forEach(function (event) { core.on(event, view.render); });
}

/**
 * Inherits from `EventEmitter`.
 */
util.inherits(ContextView, EventEmitter);

ContextView.prototype.clear = function () {
  this.el.innerHTML = "";
}

ContextView.prototype.render = function () {
  this.clear();

  var graph = new dagreD3.Digraph();
  var renderer = new dagreD3.Renderer();

  this.nodes.populateGraph(graph);

  var oldDrawNodes = renderer.drawNodes();
  renderer.drawNodes(function (graph, root) {
    var svgNodes = oldDrawNodes(graph, root);
    svgNodes.each(function (n) {
      var node = graph.node(n);
      var classString = "audionode type-" + node.type;
      this.setAttribute("class", classString);
      this.setAttribute("data-id", node.id);
      this.setAttribute("data-type", node.type);
    });
    return svgNodes;
  });

  // Post render manipulation of edges
  var oldDrawEdgePaths = renderer.drawEdgePaths();
  var defaultClasses = "edgePath enter";

  renderer.drawEdgePaths(function (graph, root) {
    var svgEdges = oldDrawEdgePaths(graph, root);
    svgEdges.each(function (e) {
      var edge = graph.edge(e);

      // We have to manually specify the default classes on the edges
      // as to not overwrite them
      var edgeClass = defaultClasses + (edge.param ? (" param-connection " + edge.param) : "");

      this.setAttribute("data-source", edge.source);
      this.setAttribute("data-target", edge.target);
      this.setAttribute("data-param", edge.param ? edge.param : null);
      this.setAttribute("class", edgeClass);
    });

    return svgEdges;
  });

  renderer.postRender(function (graph, root) {
    if (graph.isDirected() && root.select("#arrowhead").empty()) {
      root
        .append("svg:defs")
        .append("svg:marker")
        .attr("id", "arrowhead")
        .attr("viewBox", "0 0 10 10")
        .attr("refX", ARROW_WIDTH)
        .attr("refY", ARROW_HEIGHT)
        .attr("markerUnits", "strokewidth")
        .attr("markerWidth", ARROW_WIDTH)
        .attr("markerHeight", ARROW_HEIGHT)
        .attr("orient", "auto")
        .attr("style", "fill: #aaa")
        .append("svg:path")
        .attr("d", "M 0 0 L 10 5 L 0 10 z");
    }
  });

  var layout = dagreD3.layout().rankDir("LR")
  renderer.layout(layout).run(graph, d3.select(this.el));
  this.emit("rendered");
}
