# 🚀 RedisChannelForwarding

A lightweight script for forwarding messages between Redis channels — perfect for bridging systems like Minecraft chat plugins across servers.

## 📌 What Is It?

**RedisChannelForwarding** is a simple Node.js script powered by [ioredis](https://github.com/luin/ioredis) that listens to one Redis channel and republishes parsed and formatted messages to another channel.

## 🧩 Use Cases

- Forward messages between Redis channels with minimal setup  
- Bridge chat between incompatible Minecraft plugins or servers  
- Build quick Redis-based message forwarding between microservices  

I personally use it in my Minecraft server network to connect two different chat plugins.

## ⚙️ Requirements
 
- [`ioredis`](https://www.npmjs.com/package/ioredis) version **5.6.1 or higher**

## 🚀 Usage

### 1. Install dependencies

```bash
npm install ioredis
```

### 2. Configure Redis connection

Update the connection config in `rcf.js`:

```js
const redisSub = new Redis({
    host: 'your-redis-host',
    port: 6379,
    password: 'your-password'
});

const redisPub = new Redis({
    host: 'your-redis-host',
    port: 6379,
    password: 'your-password'
});
```

### 3. Run the script

```bash
node rcf.js
```

## 🔄 How It Works

Example: Minecraft Chat Messages

1. Subscribes to a source Redis channel (e.g., `channel1`)  
2. Parses incoming messages (typically Minecraft JSON chat format)  
3. Extracts the player name, UUID, and chat content  
4. Builds a new structured message with hover/click events  
5. Publishes it to the target channel (`channel2`) for each defined target server (e.g., `server1`, `server2`, `server3`)

## 📦 Example Message Structure

Each forwarded message includes:

- `fromServer`: the source server name  
- `fromPlayerUUID`: sender UUID  
- `message`: Minecraft JSON chat format, with hover/click events  
- `toMCServer`: target server name  
- `type`: always `"PUBLIC_MESSAGE"`

## 🛡️ Error Handling

The script includes error handling for:

- Invalid JSON structures  
- Message parsing failures  
- Unexpected format issues  

Errors are logged to the console without crashing the script.

## 📁 Project Structure

```plaintext
RedisChannelForwarding/
├── rcf.js         # Main forwarding script
├── README.md      # This file
└── package.json   # Dependency definitions
```
