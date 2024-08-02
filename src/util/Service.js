export default class ApiService {
    static headers = {
        'Content-Type': 'application/json',
    };

    /**
     * Makes a GET request to the specified URL with the given headers.
     *
     * @param {string} url - The URL to send the GET request to.
     * @returns {Promise<object>} - The response JSON from the server.
     */
    static async getRequest(url) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: ApiService.headers,
            });
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            return data;
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
            const response = await fetch(url, {
                method: 'POST',
                headers: ApiService.headers,
                body: JSON.stringify(requestData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error making POST request:', error);
            throw error;
        }
    }
}
