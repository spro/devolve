#!/usr/bin/env node
// Generated by CoffeeScript 1.6.3
(function() {
  var argv, dns, fallback, server;

  dns = require('native-dns');

  argv = require('optimist').alias('f', 'fallback').alias('v', 'verbose').argv;

  if (argv.fallback != null) {
    fallback = (typeof argv.fallback === 'string' && argv.fallback) || '8.8.8.8';
  }

  if (fallback && (argv.verbose != null)) {
    console.log("[debug] Fallback host is " + fallback);
  }

  server = dns.createServer();

  server.on('listening', function() {
    return console.log("[info] DNS server running.");
  });

  server.on('request', function(req, res) {
    var question, sub_req;
    if (req.question[0].name.slice(-4) === '.dev') {
      if (argv.verbose != null) {
        console.log("[debug] Caught " + req.question[0].name);
      }
      res.answer.push(dns.A({
        name: req.question[0].name,
        address: '127.0.0.1',
        ttl: 86400
      }));
      return res.send();
    } else {
      if (fallback != null) {
        if (argv.verbose != null) {
          console.log("[debug] Passing " + req.question[0].name);
        }
        question = dns.Question({
          name: 'www.google.com',
          type: 'A'
        });
        sub_req = dns.Request({
          question: question,
          server: {
            address: fallback,
            port: 53,
            type: 'udp'
          },
          timeout: 1000
        });
        sub_req.on('message', function(err, sub_res) {
          sub_res.answer.forEach(function(a) {
            return res.answer.push(a);
          });
          return res.send();
        });
        return sub_req.on('timeout', function() {
          if (argv.verbose != null) {
            console.log("[debug] Timed out " + req.question[0].name);
          }
          res.header.rcode = dns.consts.NAME_TO_RCODE.NOTFOUND;
          return res.send();
        });
      } else {
        if (argv.verbose != null) {
          console.log("[debug] Ignoring " + req.question[0].name);
        }
        res.header.rcode = dns.consts.NAME_TO_RCODE.NOTFOUND;
        return res.send();
      }
    }
  });

  server.on('error', function(err, buff, req, res) {
    return console.log("[error] " + err.stack);
  });

  server.serve(53);

}).call(this);
