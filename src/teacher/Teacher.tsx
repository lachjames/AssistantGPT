import React, { useState, useEffect, useCallback } from 'react';
import { DialogNode, useConversation } from '../conversation';
import { Box, Container, Typography } from '@mui/material';
import { List, ListItem, ListItemText, TextField, Button, Grid } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Select, MenuItem } from '@mui/material';
import { AppBar, Toolbar } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import useApiKey from '../openai_api/api_key';
import Modal from '@mui/material/Modal';
import { SettingsWindow, useSettings } from '../Settings';

// import TreeSelector from './TreeSelector';

const MODAL_STYLE = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Dropzone = ({ onDrop }: { onDrop: (acceptedFiles: File[]) => void }) => {
    const [isDragging, setIsDragging] = useState(false);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            setIsDragging(false);
            onDrop(acceptedFiles);
        },
        onDragEnter: () => setIsDragging(true),
        onDragLeave: () => setIsDragging(false),
    });

    return (
        <Button
            variant="contained"
            {...getRootProps()}
            style={{
                backgroundColor: isDragging ? '#b0b0b0' : '#3c3c3c',
            }}
        >
            <input {...getInputProps()} />
            Load
        </Button>
    );
};

const AutoScrollChatWindow = ({ children }: { children: React.ReactNode }) => {
    const settings = useSettings();

    const tolerance = 40;
    const [scroll, setScroll] = useState(false);
    const [curTimeout, setCurTimeout] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Disable effect if user is actively scrolling right now
        if (scroll) {
            return;
        }

        const chatWindow = document.getElementById('chat-window')
        if (
            chatWindow &&
            chatWindow.scrollHeight - chatWindow.scrollTop - chatWindow.clientHeight < tolerance
        ) {
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    }, [scroll, children]);

    return (
        <div
            id="chat-window"
            style={{
                // Expand in parent flex
                flexGrow: 1,
                width: "100%",
                overflowY: 'scroll',
                overflowX: 'hidden',
            }}
            onScroll={(e) => {
                // Set as scroll = true
                console.log("Scrolling");
                setScroll(true);
                // Set as scroll = false after 1 second (unless we're still scrolling)
                if (curTimeout) {
                    clearTimeout(curTimeout);
                }
                setCurTimeout(setTimeout(() => setScroll(false), 200));
            }}
        >
            {children}
        </div>
    );
};

const ChatWindow = (props: { path: DialogNode[] }) => {
    const { currentNode, setCurrentNode } = useConversation();

    const handleClick = (node: DialogNode) => {
        console.log("Clicked on:", node);
        if (node.role === 'user' && node.children.length === 1) {
            const assistantNode = node.children.find((child) => child.role === 'assistant');
            if (assistantNode) {
                console.log("Found assistant node");
                setCurrentNode(assistantNode);
                return;
            }
            console.log("Didn't find assistant node")
        }

        console.log("Setting current node")
        setCurrentNode(node);
    };

    return (
        <>
            <AutoScrollChatWindow>
                {props.path.map((node) => (
                    <div
                        key={node.uuid}
                        onClick={() => handleClick(node)}
                        style={{
                            padding: '8px',
                            borderRadius: '10px',
                            // backgroundColor: '#e0e0e0',
                            backgroundColor: node.role === 'user' ? '#cacaca' : '#e0e0e0',
                            marginBottom: node.role === 'user' ? '2px' : '8px',
                            // marginBottom: node.role === 'user' ? '3px' : '9px',
                            cursor: 'pointer',
                            // Scroll
                        }}
                    >
                        <Message node={node} />
                    </div>
                ))}
                {currentNode.children.length > 0 && (
                    <List>
                        {currentNode.children.map((child) => (
                            <ListItem key={child.uuid} button onClick={() => handleClick(child)}>
                                <ListItemText
                                    // primary={child.role[0].toUpperCase() + child.role.slice(1)}
                                    // secondary={child.summary ? child.summary : child.response.slice(0, 100) + "..."}
                                    primary={child.summary ? child.summary : child.response.slice(0, 100) + "..."}
                                    secondary={(child?.children[0] && child.children[0].summary) ? child.children[0].summary : child.children[0].response.slice(0, 100) + "..."}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
                {/* </div> */}
            </AutoScrollChatWindow>
            <ChatInput currentNode={currentNode} />
        </>
    );
};

/*
    Assistant messages are in pastel blue and aligned to the left
    User messages are in pastel green and aligned to the right
*/
function Message({ node }: { node: DialogNode }) {
    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <b>{node.role[0].toUpperCase() + node.role.slice(1)}</b>
                    {/* Spacer */}
                    <div style={{ width: '10%' }} />
                    <span style={{ color: '#606060', justifyContent: 'flex-end' }}>
                        <i>{node.summary}</i>
                    </span>
                </div>
            </Grid>
            <Grid item xs={12}>
                {/* <Typography variant="body1">{node.message}</Typography> */}
                <div style={{ marginTop: '-10px', marginBottom: '-10px' }}>
                    <ReactMarkdown
                        components={{
                            // p: Typography,
                        }}
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                    >
                        {node.response}
                    </ReactMarkdown>
                </div>
            </Grid>
        </Grid >
    );
}

function ChatInput({ currentNode }: { currentNode: DialogNode }) {
    const settings = useSettings();

    const { userResponse } = useConversation();
    const [message, setMessage] = useState('');

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    }, []);

    const handleClick = useCallback(() => {
        userResponse(currentNode, message, 'user');
        setMessage('');
        // Scroll to bottom of chat window
        const chatWindow = document.getElementById('chat-window');
        if (chatWindow) {
            // chatWindow.scrollTop = chatWindow.scrollHeight;
            // Delay by 100ms to allow the message to be rendered
            setTimeout(() => {
                chatWindow.scrollTop = chatWindow.scrollHeight;
            }, 100);
        }
    }, [message, currentNode, userResponse]);

    if (!settings.openaiApiKey) {
        return (
            <div style={{
                paddingTop: "12px",
                // Centered
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
            }}>
                <h1>
                    Welcome! Please set your OpenAI API key in the settings panel (top-right corner).
                </h1>
            </div>
        )
    }

    return (
        <div style={{ flexGrow: 0, height: settings.warn ? "180px" : '160px', width: "100%", paddingTop: "12px", }}>
            <TextField
                multiline
                rows={settings.warn ? 3 : 4}
                variant="outlined"
                value={message}
                onChange={handleChange}
                // On control-enter (or cmd-enter on Mac), send the message
                onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                        handleClick();
                    }
                }}
                style={{ marginRight: '16px', width: "100%", marginBottom: "6px" }}
            />
            {settings.warn ? (
                <div style={{ fontSize: '14px', color: 'black' }}>
                    <i>Any AI system might produce inaccurate information, and/or be prone to bias. This app uses the OpenAI API, which I do not control and take no responsibility for. You use this app entirely at your own risk.</i>
                </div>
            ) : null}
            <Button variant="contained" color="primary" onClick={handleClick}
                style={{ marginTop: "0px", width: "100%", height: "30px" }}
            >
                Send
            </Button>
        </div >
    );
}

export default function Teacher() {
    const {
        currentNode,
        createTree, setTree,
        saveToFile, loadFromFile,
        resetConversation
    } = useConversation();
    const [treeSelectorOpen, setTreeSelectorOpen] = useState(false);
    const { promptForApiKey } = useApiKey();

    const [settingsOpen, setSettingsOpen] = useState(false);

    const getPathToNode = (node: DialogNode): DialogNode[] => {
        const path: DialogNode[] = [];
        let current: DialogNode | null = node;
        while (current) {
            path.unshift(current);
            if (!current.parent)
                break;
            current = current.parent;
        }
        return path;
    };

    const clearConversation = () => {
        // Prompt user to confirm
        if (window.confirm("Are you sure you want to clear your conversation history?")) {
            resetConversation();
        }
    };

    const pathToCurrentNode = getPathToNode(currentNode);
    const currentRoot = pathToCurrentNode[0];

    const handleDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0)
            return;
        if (acceptedFiles.length > 1) {
            alert("Only one file can be loaded at a time");
            return;
        }
        const file = acceptedFiles[0];
        loadFromFile([file]);
    }, [loadFromFile]);

    return (
        <Box
            sx={{
                "& .MuiButton-root": {
                    backgroundColor: "#3c3c3c",
                    color: "white",
                    "&:hover": {
                        backgroundColor: "#5c5c5c",
                        color: "white",
                    }
                },
            }}
        >
            <Modal open={settingsOpen} onClose={() => setSettingsOpen(false)}>
                <Box sx={MODAL_STYLE}>
                    <SettingsWindow />
                </Box>
            </Modal>
            <div style={{
                backgroundColor: '#f5f5f5',
                height: '-webkit-fill-available',
                width: '100vw',
                // No scroll bars
                overflow: 'none'
            }}>
                <AppBar position="static" sx={{
                    backgroundColor: '#1e1e1e',
                    color: 'white',
                    width: '100%',
                    height: "64px",
                    // Center content vertically
                    display: "flex",
                    justifyContent: "center",
                    // alignItems: "center",
                }}>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{
                            flexGrow: 1,
                            marginRight: "12px",
                            // Scale down if the window is too small
                            fontSize: { xs: '1.1em', sm: '1.2em', md: '1.25em' },
                        }}>
                            AssistantGPT
                        </Typography>
                        <Button variant="contained" onClick={saveToFile} sx={{
                            marginRight: { xs: '2px', sm: '4px', md: '6px' },
                        }}>
                            Save
                        </Button>
                        <Box sx={{
                            marginRight: { xs: '2px', sm: '4px', md: '6px' },
                        }}>
                            <Dropzone onDrop={handleDrop} />
                        </Box>
                        <Button variant="contained" onClick={clearConversation} sx={{
                            marginRight: { xs: '2px', sm: '4px', md: '6px' },
                        }}>
                            Clear
                        </Button>
                        <Button variant="contained" onClick={() => setSettingsOpen(true)} sx={{
                            marginRight: { xs: '2px', sm: '4px', md: '6px' },
                        }}>
                            Settings
                        </Button>
                    </Toolbar>
                </AppBar>
                {/* <TreeSelector open={treeSelectorOpen} onClose={() => setTreeSelectorOpen(false)} /> */}
                <div style={{ width: "100%", height: "100%", maxWidth: "1400px", margin: "auto" }}>
                    <div style={{
                        padding: "12px",
                        // Expand to fill height and width
                        height: "calc(100vh - 90px)",
                        width: "100%",
                        maxWidth: "90vw",
                        margin: "auto",
                        // Column flex
                        display: "flex",
                        flexDirection: "column",
                        // Centered
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <ChatWindow path={pathToCurrentNode} />
                    </div>
                </div>
            </div>
        </Box >
    );
}
