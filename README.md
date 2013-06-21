devolve
=======

Mini DNS server to route *.dev domains to localhost.

## Usage:

1. Install: `npm install -g devolve`
2. Run (requires port 53 priviledges): `sudo devolve`
3. Add the IP of the machine devolve is running on as a DNS resolver.
4. Access *something*.dev and watch it get routed to 127.0.0.1
