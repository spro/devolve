// Generated by CoffeeScript 1.6.3
(function() {
  var dns, server;

  dns = require('native-dns');

  server = dns.createServer();

  server.on('listening', function() {
    return console.log("[info] DNS server running.");
  });

  server.on('request', function(req, res) {
    if (req.question[0].name.slice(-4) === '.dev') {
      console.log("[debug] Caught " + req.question[0].name);
      res.answer.push(dns.A({
        name: req.question[0].name,
        address: '127.0.0.1',
        ttl: 600
      }));
    } else {
      console.log("[debug] Skipping " + req.question[0].name);
      res.header.rcode = dns.consts.NAME_TO_RCODE.NOTFOUND;
    }
    return res.send();
  });

  server.on('error', function(err, buff, req, res) {
    return console.log("[error] " + err.stack);
  });

  server.serve(53);

}).call(this);
