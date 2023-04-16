import { useCallback } from 'react';
import { fileSave } from 'browser-fs-access';
import { useDropzone } from 'react-dropzone';
import { parse, stringify } from 'yaml'
import { DialogNode, DialogRoot } from './conversation';

const useJSONSaveLoad = () => {
    const loadJSON = useCallback(() => {
        return new Promise<{ nodes: Map<string, DialogNode>, roots: Map<string, DialogRoot> }>((resolve, reject) => {
            function handleFileSelect(e: any) {
                const files = e?.target?.files;
                if (!files || files.length === 0) {
                    reject(new Error("No files selected"));
                    return;
                }
                const file = files[0];
                const reader = new FileReader();

                reader.onload = (event) => {
                    if (!event.target || !event.target.result) {
                        reject(new Error("Error reading file"));
                        return;
                    }
                    if (event.target.result instanceof ArrayBuffer) {
                        reject(new Error("Invalid file format"));
                        return;
                    }

                    const yamlData = parse(event.target.result);
                    resolve(yamlData);
                };

                reader.readAsText(file);
            }

            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.yaml, .yml';
            input.onchange = handleFileSelect;
            input.click();
        });
    }, []);

    const saveJSON = useCallback((data: any) => {
        const yamlData = stringify(data);
        const blob = new Blob([yamlData], { type: 'text/yaml' });

        fileSave(blob);
    }, []);

    return { loadJSON, saveJSON };
};

export default useJSONSaveLoad;
