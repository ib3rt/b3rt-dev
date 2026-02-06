---
title: "Quick Start Guide: Your First Steps with Life OS"
date: "February 05, 2026"
read_time: "8 min read"
category: "Life OS"
tags: ["Life OS", "Getting Started", "Tutorial"]
---

# Quick Start Guide: Your First Steps with Life OS

Welcome to Life OS—your personal operating system for AI-powered productivity. This guide walks you through the essential first steps to get your system running smoothly.

## Prerequisites

Before you begin, ensure you have:

- A computer running Linux, macOS, or Windows with WSL2
- Node.js version 18 or higher installed
- At least 2GB of available RAM
- 500MB of free storage space
- A GitHub account for version control and deployment

## Installation Steps

### Step 1: Install OpenClaw

OpenClaw is the core framework that powers Life OS. Install it globally using npm:

```bash
npm install -g openclaw
```

This command downloads and installs the OpenClaw CLI, which you'll use to manage your entire system.

### Step 2: Initialize Your Workspace

Create a new directory for your Life OS and initialize the framework:

```bash
mkdir my-life-os
cd my-life-os
openclaw init
```

The initialization process prompts you for:
- Your name and preferred AI model
- Channel preferences (Telegram, Discord, etc.)
- Initial skill selections

### Step 3: Configure Your Gateway

The gateway acts as the central hub for all agent communications. Start it with:

```bash
openclaw gateway start
```

By default, the gateway runs on localhost:18789. You can access the dashboard at http://localhost:18789/dashboard.

### Step 4: Connect Your Channels

Life OS communicates through various channels. Connect your preferred platforms:

```bash
# Connect Telegram
openclaw channel add telegram --token YOUR_BOT_TOKEN

# Connect Discord  
openclaw channel add discord --token YOUR_DISCORD_TOKEN
```

## Verifying Your Setup

After installation, run the health check to ensure everything works:

```bash
openclaw healthcheck
```

A successful output shows:
- Gateway status: running
- Active channels: connected
- Agent count: 0 (initially)
- Memory: operational

## Your First Agent

Deploy a simple agent to test the system:

```bash
openclaw agent deploy --name hello-world --type genesis
```

This deploys a basic "Hello World" agent that responds to messages.

## Understanding the Directory Structure

Life OS organizes your workspace with a clear hierarchy:

```
my-life-os/
├── agents/           # Your AI agents
├── brands/           # Website and content
├── tools/            # Automation scripts
├── memory/           # Session logs and knowledge
└── automation/       # Scheduled tasks
```

## Next Steps

With your basic setup complete, consider these next actions:

1. **Deploy genesis agents** - Start with the 17 foundational agents
2. **Configure skills** - Add capabilities like web search, file management
3. **Set up deployment** - Connect to Cloudflare Pages for your websites
4. **Create your first workflow** - Automate a repetitive task

## Common Installation Issues

### Node Version Mismatch

If you see version errors, check your Node installation:

```bash
node --version
```

Upgrade Node.js if below version 18 using nvm or your system's package manager.

### Port Conflicts

The gateway uses port 18789 by default. If this port is in use, specify an alternative:

```bash
openclaw gateway start --port 18790
```

### Permission Errors

On Linux/macOS, you may need sudo for global installs:

```bash
sudo npm install -g openclaw
```

## Conclusion

You now have a functional Life OS installation. The system is designed to grow with your needs—start simple, add complexity as required, and let the agents handle the rest.

The journey from this basic installation to a fully autonomous personal AI system takes time. Pace yourself, experiment often, and don't hesitate to modify the default configurations to match your workflow.

---

*Part of the Life OS Article Collection - Building the future of personal AI automation.*
