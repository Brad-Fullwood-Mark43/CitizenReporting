# Citizen Incident Reporting Portal

A simple web form for citizens to report non-emergency incidents to their local police department. This demo integrates with Mark43 RMS via Prismatic.

## Features

- Clean, mobile-responsive web form
- Multiple agency support (multi-tenant)
- Integrates with Prismatic webhook
- Sends reports to Mark43 RMS

## Local Development

```bash
npm install
npm start
```

Visit http://localhost:3000

## Environment Variables

- `PORT` - Server port (default: 3000)
- `PRISMATIC_WEBHOOK_URL` - Webhook URL from Prismatic integration

## Deployment to Railway

1. Push code to GitHub
2. Connect Railway to your repository
3. Add `PRISMATIC_WEBHOOK_URL` environment variable
4. Deploy

## Flow

1. Citizen fills out form
2. Form submits to `/submit-report`
3. Server sends data to Prismatic webhook
4. Prismatic routes to appropriate Mark43 tenant
5. Incident created in Mark43 RMS
