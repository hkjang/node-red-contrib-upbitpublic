const axios = require("axios")

module.exports = function (RED) {
    function FunctionNode(n) {
        RED.nodes.createNode(this, n);

        var node = this;
        this.name = n.name;
        node.options = {};
        node.options.params = {};
        for (var key in n) {
            if (key !== 'x' && key !== 'y' && key !== 'z' && key !== 'creds' && key !== 'id'&& key !== 'type' && key !== 'wires' && key !== 'name'
                && n[key] !== ''&& typeof n[key] !== 'undefined') {
                node.options.params[key] = n[key] || "";
                node[key] = n[key] || "";
            }
        }

        this.on('input', function (msg) {
            for (var i in msg) {
                if (i !== 'req' | i !== 'res' | i !== 'payload' | i !== 'send' | i !== '_msgid') {
                    node[i] = node[i] || msg[i];
                }
            }
            if(node.params){
                node.options.params = node.params;
            }
            var url = 'https://api.upbit.com/v1/' + node.api;

            axios.get(url, node.options)
                .then(function (response){
                    msg.payload = response.data;
                    node.send(msg);
                }).catch(function (err){
                    msg.payload = err;
                    node.send(msg);
                });
        });
    }

    RED.nodes.registerType("upbitpublic", FunctionNode, {

    });

};
