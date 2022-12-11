const axios = require('axios');

module.exports.getCoordinates = async (location) => {
  try {
    // Make a GET request to the Google Geocode API to retrieve the coordinates for the given address
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: `${location}, San Francisco, California`,
        key: process.env.MAPS_API_KEY,
      },
    });

    // Extract the latitude and longitude from the response
    const lat = response.data.results[0].geometry.location.lat;
    const lng = response.data.results[0].geometry.location.lng;

    // Return the coordinates as an object
    return { lat, lng };
  } catch (error) {
    console.error(error);
  }
};

module.exports.analyzeTranscript = async (transcript) => {
  try {
    // Make a POST request to the specified API using axios
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/dbmdz/bert-large-cased-finetuned-conll03-english',
      {
        inputs: transcript,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      }
    );

    // Return the response as a JSON object
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

module.exports.analyzePriority = (transcript) => {
  // Use regex to search for keywords that indicate a high-priority call
  const highPriorityKeywords = [
    'shots',
    'kill',
    'gun',
    'shot',
    'fire',
    'injured',
    'robbery',
    'assault',
    'homicide',
    'kidnapping',
    'armed',
    'suspect',
    'explosion',
  ];
  const highPriorityRegex = new RegExp(highPriorityKeywords.join('|'), 'gi');

  // Use regex to search for keywords that indicate a medium-priority call
  const mediumPriorityKeywords = [
    'suspicious',
    'traffic',
    'accident',
    'noise',
    'complaint',
    'missing person',
    'animal',
    'bite',
    'vandalism',
    'fight',
    'break-in',
  ];
  const mediumPriorityRegex = new RegExp(mediumPriorityKeywords.join('|'), 'gi');

  // Use regex to search for keywords that indicate a low-priority call
  const lowPriorityKeywords = ['lost', 'property', 'inquiry', 'advice', 'noise', 'graffiti'];
  const lowPriorityRegex = new RegExp(lowPriorityKeywords.join('|'), 'gi');

  // Check if transcript contains any high-priority keywords
  if (transcript.match(highPriorityRegex)) {
    return 'HIGH';
  }
  // Check if transcript contains any medium-priority keywords
  else if (transcript.match(mediumPriorityRegex)) {
    return 'MEDIUM';
  }
  // Check if transcript contains any low-priority keywords
  else if (transcript.match(lowPriorityRegex)) {
    return 'LOW';
  }
  // If no keywords are found, return unknown priority
  else {
    return 'TBD';
  }
};
