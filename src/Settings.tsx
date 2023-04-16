import React, { useCallback, useState, useEffect, createContext, useContext } from 'react';
import { RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, ToggleButton } from '@mui/material';
import Button from '@mui/material/Button';

export interface Settings {
    model: string;
    warn: boolean;
    instructions: string;
    prompt: string;
    openaiApiKey: string;
    setValue: (key: keyof Settings, value: any) => void;
    reset: () => void;
}

const defaultSettings: Settings = {
    model: 'gpt-3.5-turbo',
    warn: true,
    instructions: '',
    prompt: '',
    openaiApiKey: '',
    setValue: (key, value) => { throw new Error('setValue not implemented'); },
    reset: () => { throw new Error('reset not implemented'); },
};

export const SettingsContext = createContext<Settings>(defaultSettings);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>(() => {
        const storedSettings = localStorage.getItem('settings');
        return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
    });

    const setValue = useCallback((key: keyof Settings, value: any) => {
        setSettings((prev) => {
            const newSettings = { ...prev, [key]: value };
            localStorage.setItem('settings', JSON.stringify(newSettings));
            return newSettings;
        });

        if (key === 'openaiApiKey') {
            console.log("Setting OpenAI API Key to", value);
            localStorage.setItem('openai-api-key', value);
        }
    }, []);

    const reset = useCallback(() => {
        localStorage.removeItem('settings');
        setSettings(defaultSettings);
    }, []);

    // Load values from local storage on load
    useEffect(() => {
        const storedSettings = localStorage.getItem('settings');
        if (storedSettings) {
            setSettings(JSON.parse(storedSettings));
        }

        // Load API key separately
        const storedApiKey = localStorage.getItem('openai-api-key');
        if (storedApiKey) {
            setValue('openaiApiKey', storedApiKey);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // useEffect(() => {
    //     localStorage.setItem('settings', JSON.stringify(settings));
    // }, [settings]);

    return (
        <SettingsContext.Provider value={
            { ...settings, setValue, reset }
        }>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);

export const SettingsWindow: React.FC = () => {
    const settings = useSettings();
    const { setValue } = settings;


    const handleModelChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setValue('model', event.target.value);
    }, [setValue]);

    const handleAPIKeyChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setValue('openaiApiKey', event.target.value);
    }, [setValue]);

    const toggleWarning = useCallback(() => {
        setValue('warn', !settings.warn);
    }, [setValue, settings.warn]);

    return (
        <div style={{
            margin: '-10px',
            // Elements are positioned in the center
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
        }}>
            <h1 style={{ paddingTop: '0px', marginTop: '0px' }}>Settings</h1>
            <FormControl component="fieldset">
                <FormLabel component="legend">Model</FormLabel>
                <RadioGroup
                    aria-label="model"
                    name="model"
                    value={settings.model}
                    onChange={handleModelChange}
                >
                    <FormControlLabel
                        value="gpt-3.5-turbo"
                        control={<Radio />}
                        label="gpt-3.5-turbo"
                    />
                    <FormControlLabel
                        value="gpt-4"
                        control={<Radio />}
                        label="gpt-4"
                    />
                </RadioGroup>
                <label htmlFor="openai-api-key">OpenAI API Key</label>
                <input
                    id="openai-api-key"
                    value={settings.openaiApiKey}
                    onChange={handleAPIKeyChange}
                />
                <ToggleButton value="check" selected={settings.warn} onChange={toggleWarning}>
                    Show warning
                </ToggleButton>
                <Button onClick={settings.reset}>Reset</Button>
            </FormControl>
        </div>
    );
};
