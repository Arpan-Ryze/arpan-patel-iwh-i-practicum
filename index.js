require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.HUBSPOT_ACCESS_TOKEN;
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE;

// ROUTE 1
app.get('/', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?properties=name,bio,type`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(url, { headers });
        const records = response.data.results;
        res.render('homepage', { title: 'Homepage | Custom Object Records', records });
    } catch (error) {
        console.error('Error fetching records:', error.response?.data || error.message);
        res.status(500).send('Failed to fetch records');
    }
});

// ROUTE 2:
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// ROUTE 3:
app.post('/update-cobj', async (req, res) => {
    const { name, bio, type } = req.body;

    const data = {
        properties: {
            name,
            bio,
            type
        }
    };

    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(url, data, { headers });
        res.redirect('/');
    } catch (error) {
        console.error('Error creating record:', error.response?.data || error.message);
        res.status(500).send('Failed to create record');
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));