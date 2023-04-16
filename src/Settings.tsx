import React, { useState, useEffect, createContext, useContext } from 'react';
import { RadioGroup, FormControlLabel, Radio, FormControl, FormLabel } from '@mui/material';

export interface Settings {
    model: string;
    instructions: string;
    prompt: string;
    openaiApiKey: string;
}

const defaultSettings: Settings = {
    model: 'gpt-4',
    instructions: '',
    prompt: '',
    openaiApiKey: '',
};

export const SettingsContext = createContext<Settings>(defaultSettings);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>(() => {
        const storedSettings = localStorage.getItem('settings');
        return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
    });

    // Load values from local storage on load
    useEffect(() => {
        const storedSettings = localStorage.getItem('settings');
        if (storedSettings) {
            setSettings(JSON.parse(storedSettings));
        }

        // Load API key separately
        const storedApiKey = localStorage.getItem('openai-api-key');
        if (storedApiKey) {
            settings.openaiApiKey = storedApiKey;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        localStorage.setItem('settings', JSON.stringify(settings));
    }, [settings]);

    return (
        <SettingsContext.Provider value={settings}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);

export const SettingsWindow: React.FC = () => {
    const settings = useSettings();
    const [openaiApiKey, setOpenaiApiKey] = useState(settings.openaiApiKey);

    const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOpenaiApiKey(event.target.value);
        settings.openaiApiKey = event.target.value;
    };
    const [model, setModel] = useState(settings.model);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setModel(event.target.value);
        settings.model = event.target.value;
    };

    return (
        <div style={{ margin: '-10px' }}>
            <h1 style={{ paddingTop: '0px', marginTop: '0px' }}>Settings</h1>
            <FormControl component="fieldset">
                <FormLabel component="legend">Model</FormLabel>
                <RadioGroup
                    aria-label="model"
                    name="model"
                    value={model}
                    onChange={handleChange}
                >
                    <FormControlLabel
                        value="gpt-4"
                        control={<Radio />}
                        label="gpt-4"
                    />
                    <FormControlLabel
                        value="gpt-3.5-turbo"
                        control={<Radio />}
                        label="gpt-3.5-turbo"
                    />
                </RadioGroup>
                <label htmlFor="openai-api-key">OpenAI API Key</label>
                <input
                    type="password"
                    id="openai-api-key"
                    value={openaiApiKey}
                    onChange={handleApiKeyChange}
                />
            </FormControl>
        </div>
    );
};
