// import React, { useState } from 'react';
// import { DialogNode, DialogRoot, useConversation } from '../state';
// import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, useMediaQuery, useTheme } from '@mui/material';
// import { Box } from '@mui/system';
// import { Drawer, List, ListItem, ListItemText, ListItemIcon, Divider, IconButton, Typography } from '@mui/material';
// import { TreeView, TreeItem } from '@mui/lab';
// import { CheckSquare, MinusSquare, PlusSquare } from 'react-feather';
// import SchoolIcon from '@mui/icons-material/School';
// interface TreeSelectorProps {
//     open: boolean;
//     onClose: () => void;
// }

// class TreeNode<T> {
//     name: string;
//     folders: { [key: string]: TreeNode<T> } = {};
//     objects: { [key: string]: T } = {};

//     constructor(name: string) {
//         this.name = name;
//         this.folders = {};
//         this.objects = {};
//     }
// }

// const MakeTree = (objects: DialogRoot[]): TreeNode<DialogRoot> => {
//     return objects.reduce((tree, object) => {
//         let current = tree;
//         object.path.forEach((folder) => {
//             current = current.folders[folder] ??= new TreeNode(folder);
//         });
//         current.objects[object.name] = object;
//         return tree;
//     }, new TreeNode<DialogRoot>("Root"));
// };

// const RootTree = (props: { roots: Map<string, DialogRoot> }) => {
//     const tree = MakeTree(Array.from(props.roots.values()));
//     const [expanded, setExpanded] = useState<string[]>(() => {
//         const storedExpanded = localStorage.getItem("expanded");
//         return storedExpanded ? JSON.parse(storedExpanded) : [];
//     });

//     const renderTree = (node: TreeNode<DialogRoot>) => (
//         <TreeItem
//             key={node.name}
//             nodeId={node.name}
//             label={
//                 <Typography variant="body1" style={{
//                     paddingLeft: '4px',
//                     height: '40px',
//                     // Center in parent
//                     display: 'flex',
//                     alignItems: 'center',
//                 }}>
//                     {node.name}
//                 </Typography>
//             }
//             style={{
//                 padding: "2px",
//             }}
//         >
//             {Object.keys(node.folders).map((key) => renderTree(node.folders[key]))}
//             {Object.keys(node.objects).map((key) => (
//                 <TreeItem key={key} nodeId={key} label={
//                     <Typography variant="body1" style={{
//                         paddingLeft: '4px',
//                         height: '32px',
//                         // Center in parent
//                         display: 'flex',
//                         alignItems: 'center',
//                     }}>
//                         {key}
//                     </Typography>
//                 } />
//             ))}
//         </TreeItem>
//     );

//     return (
//         <div style={{
//             height: '100%',
//             backgroundColor: '#f5f5f5',
//             padding: '8px',
//         }}>
//             <div style={{
//                 height: '30px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//             }}>
//                 <Typography variant="h6">Discussions</Typography>
//                 <div style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'flex-end',
//                     // Minimize padding between items
//                 }}>
//                     <Button style={{ fontSize: "0.75em" }} color="primary" onClick={() => {
//                         // Collapse all
//                         localStorage.setItem("expanded", JSON.stringify([]));
//                         setExpanded([]);
//                     }}>Collapse</Button>
//                     <Button style={{ fontSize: "0.75em" }} color="primary" onClick={() => {
//                         // Expand all
//                         // const expanded = [];
//                         // const expand = (node: TreeNode<DialogRoot>) => {
//                         //     expanded.push(node.name);
//                         //     Object.keys(node.folders).forEach((key) => expand(node.folders[key]));
//                         // }
//                         // expand(tree);
//                     }}>Expand</Button>
//                     <div style={{ width: '12px' }} />
//                     <Button style={{ fontSize: "0.75em" }} color="primary" onClick={() => {
//                     }}>Create</Button>

//                 </div>
//             </div>
//             <TreeView
//                 defaultCollapseIcon={<MinusSquare />}
//                 defaultExpandIcon={<PlusSquare />}
//                 defaultEndIcon={<SchoolIcon />}
//                 style={{
//                     height: 'calc(100% - 30px)',
//                     flexGrow: 1,
//                     maxWidth: "400px",
//                     width: '100vw',
//                     backgroundColor: '#f5f5f5',
//                     padding: '8px',
//                     overflowY: 'auto',
//                     overflowX: 'hidden'
//                 }}
//                 expanded={expanded}
//                 onNodeToggle={(event, nodeIds) => {
//                     localStorage.setItem("expanded", JSON.stringify(nodeIds));
//                     setExpanded(nodeIds);
//                 }}
//             >
//                 {renderTree(tree)}
//             </TreeView>
//         </div>
//     );
// };

// const TreeSelector: React.FC<TreeSelectorProps> = ({ open, onClose }) => {
//     const { roots, createTree } = useConversation();
//     const [treeName, setTreeName] = useState('');

//     if (!roots) {
//         return null;
//     }

//     const values = [];
//     roots.forEach((root) => {
//         values.push(root.name);
//     });

//     return (
//         <Drawer
//             anchor="left"
//             open={open}
//             onClose={onClose}
//         >
//             <RootTree roots={roots} />
//         </Drawer>
//     );
// };

// export default TreeSelector;

export { };