
# N8N Chat Connector

This project integrates an n8n chat widget into a modern web application with authentication. Users must log in before accessing the chat functionality.

## Features

- Clean, minimalist design inspired by Apple's design principles
- Authentication system to protect access to the chat
- Seamless integration with n8n chat widget
- Smooth animations and transitions for an enhanced user experience
- Responsive layout that works on all device sizes

## Project Info

**URL**: https://lovable.dev/projects/ad17285b-b624-4700-95cb-d09080da544f

## n8n Chat Configuration

The application connects to an n8n chat webhook endpoint. Before using the application, ensure that:

1. Your n8n workflow with a Chat Trigger node is active
2. The webhook URL in the application matches your n8n Chat Trigger node's webhook URL
3. The Chat Trigger node has the appropriate authentication settings configured
4. Your domain is added to the Allowed Origins (CORS) field in the Chat Trigger node settings

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- n8n Chat API

## Getting Started

### Local Development

1. Clone this repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Open your browser to the local development URL

### Using Docker

You can also run this application using Docker:

```bash
# Build the Docker image
docker build -t n8n-chatbot-connector .

# Run the container
docker run -p 80:80 n8n-chatbot-connector
```

Then access the application at http://localhost.

### Using GitHub Container Registry

This repository is configured with GitHub Actions to automatically build and push Docker images to GitHub Container Registry when changes are pushed to the main branch.

To pull and run the container from GitHub Container Registry:

```bash
# Pull the latest image
docker pull ghcr.io/davidrothenfels/n8n-chatbot-connector:main

# Run the container
docker run -p 80:80 ghcr.io/davidrothenfels/n8n-chatbot-connector:main
```

## Authentication

This demo uses a simplified authentication system. In a production environment, you should replace it with proper backend authentication.

The current implementation:
- Stores credentials in localStorage (for demo purposes only)
- Passes credentials to the n8n Chat widget for basic authentication
- Provides a simple login/logout flow

## Customization

You can customize the appearance of the n8n Chat widget by modifying the CSS variables in `src/index.css`. The application uses a clean, minimal design language that you can adapt to your brand.
