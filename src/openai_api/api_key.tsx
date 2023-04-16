import React, { useCallback, useEffect, useState } from 'react';

export default function useApiKey() {
    const [apiKey, setApiKey] = useState<string | null>(null);

    // Load the API key from local storage on mount
    useEffect(() => {
        const key = localStorage.getItem('openai-api-key');
        if (key) {
            setApiKey(key);
        }
    }, []);

    // Method that prompts the user to enter their API key, and saves on enter
    const promptForApiKey = useCallback(() => {
        const key = prompt("Enter an API Key (which will be saved to local storage).\n" + (apiKey ? "Current key is:\n" + apiKey : "No API key currently set"));
        if (key) {
            setApiKey(key);
            // Set the API key in local storage
            localStorage.setItem('openai-api-key', key);
        }

    }, [apiKey, setApiKey]);

    return {
        apiKey,
        promptForApiKey,
    };
}