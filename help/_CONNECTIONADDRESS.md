The [_CONNECTIONADDRESS](_CONNECTIONADDRESS) function returns a connected user's [STRING](STRING) IP address value.

## Syntax

> result$ = [_CONNECTIONADDRESS](_CONNECTIONADDRESS)](connectionHandle&)

## Description

* The handle can come from the [_OPENHOST](_OPENHOST), [OPENCLIENT](OPENCLIENT) or [_OPENCONNECTION](_OPENCONNECTION) QB64PE TCP/IP functions.
* For **[_OPENHOST](_OPENHOST)s**: It may return "TCP/IP:8080:213.23.32.5" where 8080 is the port it is listening on and 213.23.32.5 is the global IP address which any computer connected to the internet could use to locate your computer. If a connection to the internet is unavailable or your firewall blocks it, it returns your 'local IP' address (127.0.0.1). You might like to store this address somewhere where other computers can find it and connect to your host. Dynamic IPs which can change will need to be updated.
* For **[_OPENCLIENT](_OPENCLIENT)s**: It may return "TCP/IP:8080:213.23.32.5" where 8080 is the port it used to connect to the listening host and 213.23.32.5 is the IP address of the host name it resolved.
* For **[_OPENCONNECTION](_OPENCONNECTION)s** (from clients): It may return "TCP/IP:8080:34.232.321.25" where 8080 was the host listening port it connected to and 34.232.321.25 is the IP address of the client that connected. This is very useful because the host can log the IP address of clients for future reference (or banning, for example).
* The $ symbol is optional for compatibility with older versions.

## Example(s)

A Host logging new chat clients in a Chat program. See the [_OPENHOST](_OPENHOST) example for the rest of the code used.

```vb

f = FREEFILE
OPEN "ChatLog.dat" FOR APPEND AS #f ' code at start of host section before DO loop.

newclient = _OPENCONNECTION(host) ' receive any new client connection handles
IF newclient THEN
  numclients = numclients + 1 ' increment index
  Users(numclients) = newclient ' place handle into array
  IP$ = _CONNECTIONADDRESS(newclient)
  PRINT IP$ + " has joined." ' displayed to Host only
  PRINT #f, IP$, numclients ' print info to a log file
  PRINT #Users(numclients),"Welcome!" ' from Host to new clients only
END IF 

```

> *Explanation:* The function returns the new client's IP address to the IP$ variable. Prints the IP and the original login position to a log file. The information can later be used by the host for reference  if necessary. The host could set up a ban list too. 

## See Also

* [_OPENCONNECTION](_OPENCONNECTION)
* [_OPENHOST](_OPENHOST)
* [_OPENCLIENT](_OPENCLIENT)
* [_CONNECTED](_CONNECTED)
* [WGET](WGET) (HTTP and FTP file transfer)
