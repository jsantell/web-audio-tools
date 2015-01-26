module.exports = AudioNodes;

function AudioNodes (core) {
  this.core = core;
  this.nodes = [];
  this.connections = [];
  this._createNode = this._createNode.bind(this);
  this._connectNode = this._connectNode.bind(this);
  this._disconnectNode = this._disconnectNode.bind(this);
  this._connectParam = this._connectParam.bind(this);

  core.on("create-node", this._createNode);
  core.on("connect-node", this._connectNode);
  core.on("disconnect-node", this._disconnectNode);
  core.on("connect-param", this._connectParam);
}

AudioNodes.prototype.populateGraph = function (graph) {
  for (var model of this.nodes) {
    graph.addNode(model.id, {
      type: model.type,
      label: model.type.replace(/Node$/, ""),
      id: model.id
    });
  }

  for (var edge of this.connections) {
    if (edge.disconnected) {
      continue;
    }
    var options = {
      source: edge.source.id,
      target: edge.destination.id
    };

    if (edge.param) {
      options.label = options.param = edge.param;
    }

    graph.addEdge(null, edge.source.id, edge.destination.id, options);
  }
}

AudioNodes.prototype._createNode = function (node) {
  this.nodes.push(node);
};

AudioNodes.prototype._connectNode = function (source, dest) {
  this.connections.push({
    source: source,
    destination: dest
  });
};

AudioNodes.prototype._connectParam = function (source, dest, paramName) {
  this.connections.push({
    source: source,
    destination: dest,
    param: paramName
  });
};

AudioNodes.prototype._disconnectNode = function (source) {
  for (var i = 0; i < this.nodes.length; i++) {
    var connection = this.nodes[i];
    if (connection.source === source) {
      connection.disconnected = true;
    }
  }
}

