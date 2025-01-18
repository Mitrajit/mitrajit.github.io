Accurate time synchronization is crucial for many cryptographic processes, as time-sensitive protocols like TLS, Kerberos, and token-based authentication rely on it. However, cryptography also depends on other factors like secure key management and strong algorithms.
When my Windows machine wasn't syncing its time automatically with the NTP server `time.windows.com`, I created a script to address the issue.

**Quick run**
Make sure your system is in UTC timezone.
```shell
wget https://gist.githubusercontent.com/Mitrajit/35fbff8e3826e6c1b80b195f11d3a508/raw/329aeb2a59c1b1884f3be24ac930e547af09ca19/winSetUtcDateTime.js -o winSetUtcDateTime.js
node winSetUtcDateTime.js
```

```javascript
const https = require('https');
const dgram = require('dgram');
const { exec } = require('child_process');
const util = require('util');

// Convert exec to promise
const execPromise = util.promisify(exec);

async function getTimeFromAPI() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'timeapi.io',
      path: '/api/Time/current/zone?timeZone=UTC',
      method: 'GET',
    };

    const req = https.request(options, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const timeData = JSON.parse(data);
          resolve(new Date(timeData.dateTime));
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', error => {
      reject(error);
    });

    req.end();
  });
}

function getNTPTime() {
  return new Promise((resolve, reject) => {
    const NTP_PACKET_SIZE = 48;
    const socket = dgram.createSocket('udp4');
    const ntpData = new Buffer.alloc(NTP_PACKET_SIZE);
    const TIME1970 = 2208988800; // Seconds between 1900 and 1970

    // Set NTP packet fields
    // LI = 0, Version = 3, Mode = 3 (client)
    ntpData[0] = 0x1b;

    // Send NTP packet
    socket.send(ntpData, 0, NTP_PACKET_SIZE, 123, 'pool.ntp.org', err => {
      if (err) {
        socket.close();
        reject(err);
        return;
      }
    });

    // Set timeout
    socket.setTimeout(5000, () => {
      socket.close();
      reject(new Error('NTP request timeout'));
    });

    socket.on('message', msg => {
      // Get transmit timestamp (last 8 bytes)
      const seconds = msg.readUInt32BE(40);
      const fraction = msg.readUInt32BE(44);

      // Convert to milliseconds
      const milliseconds =
        (seconds - TIME1970) * 1000 + (fraction * 1000) / 0x100000000;

      socket.close();
      resolve(new Date(milliseconds));
    });

    socket.on('error', err => {
      socket.close();
      reject(err);
    });
  });
}

async function getNISTTime() {
  return new Promise((resolve, reject) => {
    const net = require('net');
    const client = new net.Socket();

    client.connect(13, 'time.nist.gov', () => {
      // Connection established - waiting for data
    });

    client.setTimeout(5000);

    let data = '';

    client.on('data', chunk => {
      data += chunk;
    });

    client.on('end', () => {
      try {
        // Parse NIST time format
        // Example: 59859 23-01-17 13:14:11 00 0 0 523.9 UTC(NIST) *
        const parts = data.toString().trim().split(' ');
        const dateStr = parts[1];
        const timeStr = parts[2];

        const [yy, mm, dd] = dateStr.split('-');
        const fullYear = '20' + yy;

        const dateTimeStr = `${fullYear}-${mm}-${dd}T${timeStr}Z`;
        resolve(new Date(dateTimeStr));
      } catch (error) {
        reject(error);
      }
      client.destroy();
    });

    client.on('timeout', () => {
      client.destroy();
      reject(new Error('NIST connection timeout'));
    });

    client.on('error', err => {
      client.destroy();
      reject(err);
    });
  });
}

async function getAccurateTime() {
  const timeSources = [
    { name: 'NTP Pool', func: getNTPTime },
    { name: 'NIST', func: getNISTTime },
    { name: 'TimeAPI', func: getTimeFromAPI },
  ];

  for (const source of timeSources) {
    console.log(`Trying ${source.name}...`);
    try {
      const time = await source.func();
      console.log(`Successfully got time from ${source.name}`);
      return time;
    } catch (error) {
      console.log(`Failed to get time from ${source.name}:`, error.message);
    }
  }

  throw new Error('All time sources failed');
}

async function setWindowsTime(date) {
  const timeStr = date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const dateStr = date
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    .split('/')
    .join('-');

  try {
    // Set time
    await execPromise(`echo Y | time ${timeStr}`);
    console.log(timeStr);
    // Set date
    await execPromise(`date ${dateStr}`);
    console.log(dateStr);
    console.log(`System time successfully synchronized to: ${date}`);
  } catch (error) {
    throw new Error(`Failed to set system time: ${error.message}`);
  }
}

async function main() {
  try {
    // Check for admin privileges
    try {
      await execPromise('net session');
    } catch {
      console.error('Error: This script requires administrator privileges');
      console.error('Please run as administrator');
      process.exit(1);
    }

    console.log('Fetching accurate time...');
    const currentTime = await getAccurateTime();
    console.log(`Current time from server: ${currentTime}`);

    console.log('Setting system time...');
    await setWindowsTime(currentTime);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  getAccurateTime,
  setWindowsTime,
};
```

The NTP module doesn't work properly, fixes to the script is appreciated. ✌🏻