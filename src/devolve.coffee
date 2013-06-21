dns = require 'native-dns'

server = dns.createServer()

server.on 'listening', ->
    console.log "[info] DNS server running."

server.on 'request', (req, res) ->
    if req.question[0].name[-4..] == '.dev'
        console.log "[debug] Caught #{ req.question[0].name }"
        res.answer.push dns.A
            name: req.question[0].name
            address: '127.0.0.1'
            ttl: 86400
    else
        console.log "[debug] Skipping #{ req.question[0].name }"
        res.header.rcode = dns.consts.NAME_TO_RCODE.NOTFOUND
    res.send()

server.on 'error', (err, buff, req, res) ->
    console.log("[error] #{ err.stack }")

server.serve(53)
