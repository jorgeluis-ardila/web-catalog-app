const API_URL = 'https://api.escuelajs.co/api/v1';

// GET API DATA
async function getData (endpoint) {
  try {
    const response = await fetch(API_URL + endpoint);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Fetch Error', error);
  };
}

const asyncTimeout = (time) => new Promise((resolve) => setTimeout(resolve, time));

export { getData, asyncTimeout };
