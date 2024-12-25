---
title: "Pritunl: A reliable VPN solution"
---
## Background

Initially, I started with a [[OpenVPN|simple OpenVPN server installation]], but as the number of connections grew, the server struggled to scale. This led to frequent connection drops, even during critical moments like important meetings. To address these issues, I transitioned to Pritunl, a more robust and enterprise-grade VPN solution.

I followed the official [Pritunl installation guide](https://docs.pritunl.com/docs/installation#other-providers-ubuntu-2404) for Ubuntu 24.04. It is crucial to use the exact versions mentioned in the documentation at the time of reading, as updates may cause compatibility issues, which I experienced firsthand.

---
## Installation Guide for Pritunl on Ubuntu 24.04

### Steps:

1. **Add MongoDB Repository**:
```shell
sudo tee /etc/apt/sources.list.d/mongodb-org.list << EOF

deb [ signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse EOF 
```

2. **Add OpenVPN Repository**:
```shell
sudo tee /etc/apt/sources.list.d/openvpn.list << EOF

deb [ signed-by=/usr/share/keyrings/openvpn-repo.gpg ] https://build.openvpn.net/debian/openvpn/stable noble main EOF 
```

3. **Add Pritunl Repository**:
```shell
sudo tee /etc/apt/sources.list.d/pritunl.list << EOF

deb [ signed-by=/usr/share/keyrings/pritunl.gpg ] https://repo.pritunl.com/stable/apt noble main EOF 
```

4. **Install GPG and Import Keys**:
```shell
sudo apt --assume-yes install gnupg
    
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor --yes
curl -fsSL https://swupdate.openvpn.net/repos/repo-public.gpg | sudo gpg -o /usr/share/keyrings/openvpn-repo.gpg --dearmor --yes
curl -fsSL https://raw.githubusercontent.com/pritunl/pgp/master/pritunl_repo_pub.asc | sudo gpg -o /usr/share/keyrings/pritunl.gpg --dearmor --yes
```

5. **Update and Install Required Packages**:
```
sudo apt update
sudo apt --assume-yes install pritunl openvpn mongodb-org wireguard wireguard-tools
```

6. **Disable Uncomplicated Firewall (UFW)**: 
```
sudo ufw disable
```

7. **Start and Enable Services**:
```
sudo systemctl start pritunl mongod
sudo systemctl enable pritunl mongod
```
---
## Key Recommendations

- Always refer to the official documentation for up-to-date installation instructions.
- Use the exact versions specified in the documentation to avoid compatibility issues.
- Ensure your server meets the minimum system requirements for stable performance.

By following this approach, you can set up a reliable and scalable VPN solution suitable for enterprise use.