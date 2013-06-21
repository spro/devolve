devolve
=======

Mini DNS server to resolve .dev domains to localhost.

## Install

With npm: `npm install -g http://github.com/spro/devolve.git`

## Run

```sudo devolve```

**Note**: Requires root privileges to bind on port 53.

### Options

* `-v` Verbose output.
* `-f [fallback DNS IP]` Use a fallback DNS server for non-.dev domains. When used without an argument it assumes *8.8.8.8*, one of Google's public DNS servers. When not used it simply returns "not found" for non-.dev queries and assumes the system will handle fallback.