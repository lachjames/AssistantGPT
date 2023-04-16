import React, { useState, useCallback, useMemo, useEffect, useContext } from 'react';
import { DialogNode, DialogRoot, ConversationContextType } from './types';
import { ConversationContext } from './context';
import useJSONSaveLoad from '../useSaveLoadJSON';
import { parse, stringify } from 'yaml';
import { Message, iterableStreamGPT4Message } from '../openai_api/gpt4';
import {
    TEACHER_SYSTEM_MESSAGE,
    ASSISTANT_SYSTEM_MESSAGE,
    SUMMARIZER_SYSTEM_MESSAGE,
} from '../prompts';
import { processCommands } from '../openai_api/processCommands';
import { SettingsContext } from '../Settings';

const root: DialogNode = new DialogNode(
    null, "assistant", "", "Hi there! How can I help?"
);

const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // const [trees, setTrees] = useState<DialogTrees>({
    //     "Example": root
    // });
    // const [dialogTree, setDialogTree] = useState<string>("Example");

    // const [nodes, setNodes] = useState<Map<string, DialogNode>>(new Map([
    //     [root.uuid, root]
    // ]));

    const [nodes, setNodes] = useState<{ [key: string]: DialogNode }>({
        [root.uuid]: root
    });

    const [roots, setRoots] = useState<{ [key: string]: DialogRoot }>({
        [root.uuid]: new DialogRoot(root.uuid, root, [root.uuid])
    });

    const [currentNode, setCurrentNode] = useState<DialogNode>(root);
    const { saveJSON, loadJSON } = useJSONSaveLoad();

    const settings = useContext(SettingsContext);

    // const stateVariables = {
    //     nodes, roots, currentNode,
    // };

    const stateVariables = useMemo(() => ({
        nodes, roots, currentNode,
    }), [nodes, roots, currentNode]);

    useEffect(() => {
        // Load from local storage if possible
        const stateString = localStorage.getItem('state')
        if (stateString) {
            const state = parse(stateString, { maxAliasCount: -1 });
            setNodes(state.nodes);
            setRoots(state.roots);
            setCurrentNode(state.currentNode);
        }
    }, []);

    // Update the state whenever it changes
    useEffect(() => {
        localStorage.setItem('state', stringify(stateVariables));
    }, [stateVariables]);


    const resetConversation = useCallback(() => {
        setNodes({ [root.uuid]: root });
        setRoots({ [root.uuid]: new DialogRoot(root.uuid, root, [root.uuid]) });
        setCurrentNode(root);
    }, []);
    const createNode = useCallback((parent: DialogNode, role: "user" | "assistant", response: string): DialogNode => {
        // Create a new node
        const newNode: DialogNode = new DialogNode(
            parent, role, "", response
        );

        // Add it to the parent's children
        if (parent) {
            if (!parent.children) {
                parent.children = [];
            }
            parent.children.push(newNode);
        } else {
            // Add it to the roots
            setRoots(roots => ({
                ...roots,
                [newNode.uuid]: new DialogRoot(newNode.uuid, newNode, [newNode.uuid])
            }));
        }

        // Add it to the nodes
        setNodes(nodes => ({ ...nodes, [newNode.uuid]: newNode }));

        return newNode;
    }, []);

    const deleteNode = useCallback((node: DialogNode) => {
        // Remove the node from the parent's children
        if (node.parent) {
            const parent = node.parent;
            parent.children = parent.children.filter(child => child.uuid !== node.uuid);
        }

        // Remove the node from the nodes (with map)
        setNodes(nodes => {
            const newNodes = { ...nodes };
            delete newNodes[node.uuid];
            return newNodes;
        });
    }, []);

    const respondToUser = useCallback((node: DialogNode) => {
        const summarizeNode = async (node: DialogNode) => {
            const messages: Message[] = [
                {
                    role: "system",
                    content: SUMMARIZER_SYSTEM_MESSAGE,
                },
                {
                    role: "user",
                    // content: "This is a message from the " + node.role + ".\n\n*** MESSAGE ***\n" + node.response + "\n*** END MESSAGE ***\n\nPlease summarize this message as concisely as possible, in a single sentence of 10 words or less.",
                    content: [
                        "This is a message from the " + node.role + ".",
                        "",
                        "*** MESSAGE ***",
                        node.response,
                        "*** END MESSAGE ***",
                        "",
                        "Please rewrite this message in 10 words or less, inthe same person of speech as the original message.",
                    ].join("\n")
                }
            ];

            for await (const resp of iterableStreamGPT4Message(messages, settings.model)) {
                let token = resp.token;
                node.summary += token;
                setNodes(nodes => ({ ...nodes }));
            }
        }

        const respondAsync = async (messages: Message[]) => {
            if (node.parent) {
                summarizeNode(node.parent);
            }

            for await (const resp of iterableStreamGPT4Message(messages, settings.model)) {
                let token = resp.token;
                node.response += token;
                // Update the dialog tree state
                setNodes(nodes => ({ ...nodes }));
            }

            // Summarize the nodes
            summarizeNode(node);
        }

        // Get message chain from node to root
        const pathToRoot: DialogNode[] = [];
        let current: DialogNode | null = node;
        while (current) {
            pathToRoot.unshift(current);
            current = current.parent;
        }

        // Construct the messages
        const messages: Message[] = [{
            role: "system",
            content: ASSISTANT_SYSTEM_MESSAGE
        }];

        const message = {
            role: "user",
            content: "This is the chat history with the user: *** Begin Chat History ***\n"
        };

        for (let i = 0; i < pathToRoot.length; i++) {
            const node = pathToRoot[i];
            message.content += `
**${node.role === "user" ? "User" : "Assistant"}**:
${node.response}
`;
        }

        message.content += "\n*** End Chat History ***"

        messages.push(message);

        // Move to the reply node
        setCurrentNode(node);

        // Respond to the user
        respondAsync(messages);
    }, []);

    const userResponse = useCallback((node: DialogNode, response: string, role: "user" | "assistant") => {
        // Create the new node
        const newNode = createNode(node, role, response);

        // Move to the new node
        setCurrentNode(newNode);

        if (role === "user") {
            const assistantResponse = createNode(newNode, "assistant", "");
            respondToUser(assistantResponse);
        }
    }, [createNode, respondToUser]);

    const saveToFile = useCallback(() => {
        saveJSON(stateVariables);
    }, [saveJSON, stateVariables]);

    const loadFromFile = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            if (!event.target || !event.target.result) {
                console.error("Error reading file");
                return;
            }

            const result = parse(
                event.target.result as string,
                { maxAliasCount: -1 }
            );

            console.log(result);
            const { nodes, roots, currentNode } = result;

            setNodes(nodes);
            setRoots(roots);
            setCurrentNode(currentNode);
        };

        reader.readAsText(file);
    }, []);

    const createTree = useCallback((id: string) => {
        // Create a new node
        const newRoot: DialogNode = new DialogNode(
            null, "assistant", "", "Hi there! How can I help you learn today?"
        );

        // Add it to the roots
        setRoots(roots => ({
            ...roots,
            [id]: new DialogRoot(id, newRoot, [newRoot.uuid])
        }));
    }, []);

    const setTree = useCallback((id: string) => {
        const root = roots[id];
        if (root) {
            setCurrentNode(root.root);
        }
    }, [roots]);

    return (
        <ConversationContext.Provider value={{
            ...stateVariables,
            createNode, deleteNode,
            createTree, setTree,
            userResponse,
            setCurrentNode,
            saveToFile, loadFromFile,
            resetConversation
        }}>
            {children}
        </ConversationContext.Provider>
    );
};

export default ConversationProvider;