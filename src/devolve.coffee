dns = require 'native-dns'
argv = require('optimist').alias('f', 'fallback').alias('v', 'verbose').argv

fallback = (typeof fallback == 'string' and argv.fallback) or '8.8.8.8' if argv.fallback?
console.log "[debug] Fallback host is #{ fallback }" if fallback and argv.verbose?

server = dns.createServer()

server.on 'listening', ->
    console.log "[info] DNS server running."

server.on 'request', (req, res) ->
    if req.question[0].name[-4..] == '.dev'
        console.log "[debug] Caught #{ req.question[0].name }" if argv.verbose?
        res.answer.push dns.A
            name: req.question[0].name
            address: '127.0.0.1'
            ttl: 86400
        res.send()

    else
        if fallback?
            console.log "[debug] Passing #{ req.question[0].name }" if argv.verbose?
            question = dns.Question
                name: 'www.google.com'
                type: 'A'
            sub_req = dns.Request
                question: question
                server: { address: fallback, port: 53, type: 'udp' }
                timeout: 1000
            sub_req.on 'message', (err, sub_res) ->
                sub_res.answer.forEach (a) ->
                    res.answer.push a
                res.send()
            sub_req.on 'timeout', ->
                console.log "[debug] Timed out #{ req.question[0].name }" if argv.verbose?
                res.header.rcode = dns.consts.NAME_TO_RCODE.NOTFOUND
                res.send()
        else
            console.log "[debug] Ignoring #{ req.question[0].name }" if argv.verbose?
            res.header.rcode = dns.consts.NAME_TO_RCODE.NOTFOUND
            res.send()

server.on 'error', (err, buff, req, res) ->
    console.log("[error] #{ err.stack }")

server.serve(53)
