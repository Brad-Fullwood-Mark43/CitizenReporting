const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/submit-report', async (req, res) => {
  try {
    const reportData = {
      agency: req.body.agency,
      citizenName: req.body.citizenName,
      citizenEmail: req.body.citizenEmail,
      citizenPhone: req.body.citizenPhone,
      incidentLocation: req.body.incidentLocation,
      incidentType: req.body.incidentType,
      incidentDate: req.body.incidentDate,
      incidentTime: req.body.incidentTime,
      description: req.body.description,
      submittedAt: new Date().toISOString()
    };

    console.log('Received report:', reportData);

    // Agency-to-webhook mapping for multi-tenant routing
    const agencyWebhooks = {
      'fullwooddemo': process.env.FULLWOOD_WEBHOOK_URL,
      'kelloggpolice': process.env.KELLOGG_WEBHOOK_URL,
      // Add more agencies here as needed
    };

    // Normalize agency name for lookup
    const agencyKey = reportData.agency?.toLowerCase().replace(/\s+/g, '');
    const prismaticWebhookUrl = agencyWebhooks[agencyKey];

    if (prismaticWebhookUrl) {
      console.log(`Routing to ${reportData.agency} (${agencyKey}) webhook...`);
      const response = await axios.post(prismaticWebhookUrl, reportData);
      console.log('Prismatic response:', response.status);
    } else {
      console.log(`No webhook configured for agency: ${reportData.agency} (${agencyKey})`);
      console.log('Available agencies:', Object.keys(agencyWebhooks));
    }

    res.json({
      success: true,
      message: 'Report submitted successfully!',
      reportId: `RPT-${Date.now()}`
    });
  } catch (error) {
    console.error('Error submitting report:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to submit report. Please try again.'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(PORT, () => {
  console.log(`Citizen Reporting Portal running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
