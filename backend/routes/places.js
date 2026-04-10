const express = require('express');
const router = express.Router();
const axios = require('axios');
const { jlog } = require('../utils/logger');

router.get('/autocomplete', async (req, res) => {
  try {
    const { input, components, sessiontoken } = req.query;

    if (!input) {
      jlog('places_autocomplete_missing_input');
      return res.status(400).json({ error: 'Input parameter required' });
    }

    const params = {
      input,
      key: process.env.GOOGLE_PLACES_API_KEY,
      components: components || 'country:ca',
      sessiontoken: sessiontoken || '',
    };

    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/autocomplete/json',
      { params }
    );

    jlog('places_autocomplete_completed', {
      searchTerm: input,
      status: response.data?.status,
      predictionsFound: Array.isArray(response.data?.predictions)
        ? response.data.predictions.length
        : 0,
    });

    res.json(response.data);
  } catch (error) {
    jlog('places_autocomplete_error', { error: error.message }, 'error');
    res.status(500).json({ error: error.message });
  }
});

router.get('/details', async (req, res) => {
  try {
    const { place_id, sessiontoken, fields } = req.query;

    if (!place_id) {
      jlog('places_details_missing_id');
      return res.status(400).json({ error: 'place_id required' });
    }

    const params = {
      place_id,
      key: process.env.GOOGLE_PLACES_API_KEY,
      fields: fields || 'geometry,formatted_address,name,place_id,types',
      sessiontoken: sessiontoken || '',
    };

    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json',
      { params }
    );

    jlog('places_details_completed', {
      placeId: place_id.substring(0, 20) + '...',
      status: response.data?.status,
      hasResult: !!response.data?.result,
    });

    res.json(response.data);
  } catch (error) {
    jlog('places_details_error', { error: error.message }, 'error');
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
