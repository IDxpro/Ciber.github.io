const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

// Enable CORS for all requests
app.use(cors());

// Allow the server to understand JSON format
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Proxy endpoint that forwards the request to the real API
app.post('/api/estudiante/datos', async (req, res) => {
    try {
        const externalApiUrl = 'https://api.inventores.org/api/estudiante/datos';
        
        // Load the authorization token from a variable
        const token = 'f72e6fb022129919ac6433e3dd1ae34da9b9e361a28b85cde6cebd37dce2fee6';

        const response = await axios.post(externalApiUrl, req.body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        // Forward the API's response to the browser
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            // Forward the status code and error message from the API
            res.status(error.response.status).json(error.response.data);
        } else {
            // Handle internal proxy server errors
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Servidor proxy escuchando en http://localhost:${port}`);
    console.log(`Abre tu navegador y navega a http://localhost:${port}/test.html`);
});