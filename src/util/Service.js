import axios from 'axios';

class ApiService {
    static username = 'aravind';
    static password = 'password';
    static headers = {
        'Content-Type': 'application/json',
        'token': 'fefgd0rfg-rg34td-gsdgsd-t23rfwgsdg34-vwv43v-4v4wsgfvhrty34-srhtryh'
    };

    /**
     * Makes a GET request to the specified URL with the given headers.
     *
     * @param {string} url - The URL to send the GET request to.
     * @returns {Promise<object>} - The response JSON from the server.
     */
    static async getRequest(url) {
        try {
            const response = await axios.get(url, {
                headers: ApiService.headers,
                auth: {
                    username: ApiService.username,
                    password: ApiService.password
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error making GET request:', error);
            throw error;
        }
    }

    /**
     * Makes a POST request to the specified URL with the given request data and headers.
     *
     * @param {string} url - The URL to send the POST request to.
     * @param {object} requestData - The JSON object to send in the request body.
     * @returns {Promise<object>} - The response JSON from the server.
     */
    static async postRequest(url, requestData) {
        try {
            const response = await axios.post(url, requestData, {
                headers: ApiService.headers,
                auth: {
                    username: ApiService.username,
                    password: ApiService.password
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error making POST request:', error);
            throw error;
        }
    }
}

/* Usage example:
const getUrl = 'https://example.com/api/data';
const postUrl = 'https://example.com/api/messages';
const postData = {
    message: 'Hello, this is a test message',
    sender: 'Alene'
};

ApiService.getRequest(getUrl)
    .then(response => {
        console.log('GET Response received:', response);
    })
    .catch(error => {
        console.error('GET Error:', error);
    });

ApiService.postRequest(postUrl, postData)
    .then(response => {
        console.log('POST Response received:', response);
    })
    .catch(error => {
        console.error('POST Error:', error);
    });

*/