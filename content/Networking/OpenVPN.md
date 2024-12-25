# Installation
This is the easiest method I found to setup an OpenVPN server
```shell
wget https://git.io/vpn -O openvpn-install.sh
sudo chmod +x openvpn-install.sh
./openvpn-install.sh
```
But this OpenVPN server was not reliable enough as it caused frequent disconnection and needed reconnection.
## Walkthrough
```shell
Welcome to this OpenVPN road warrior installer!

Which protocol should OpenVPN use?
   1) UDP (recommended)
   2) TCP
Protocol [1]: 1

What port should OpenVPN listen to?
Port [1194]: 

Select a DNS server for the clients:
   1) Current system resolvers
   2) Google
   3) 1.1.1.1
   4) OpenDNS
   5) Quad9
   6) AdGuard
DNS server [1]: 2

Enter a name for the first client:
Name [client]: mitrajit

OpenVPN installation is ready to begin.
Press any key to continue...
```
- In case, you want to use VPN server as a gateway to the VPC then push a route to iptables
```shell
# 10.8.0.0/24 -> VPC Subnet 
# 10.4.0.1 -> OpenVPN server IP in openvpn subnet
route add -net 10.8.0.0/24 gw 10.4.0.1
```
# Points to remember before you choose a server
- In my experience servers hosted in major cloud providers like Azure, AWS, Google rarely gets blocked(by Netflix and others).
- You can get cloud server pretty cheap as you won't need more than 1CPU and 1GB RAM to manage a small number of connections. 
- Digital Ocean server in my experience had significant problems with IP being in the blacklist and Netflix blocking the IPs