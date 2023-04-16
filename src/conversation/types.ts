export class DialogNode {
    uuid: string;
    parent: DialogNode | null;
    role: "user" | "assistant";
    children: DialogNode[] = [];
    summary: string;
    response: string;
    // parent?: DialogNode;

    constructor(parent: DialogNode | null, role: "user" | "assistant", summary: string, response: string) {
        this.uuid = crypto.randomUUID();
        this.parent = parent;
        this.role = role;
        this.summary = summary;
        this.response = response;
    }
}

export interface DialogTrees {
    [key: string]: DialogNode;
}

export class DialogRoot {
    name: string;
    root: DialogNode;
    path: string[];

    constructor(name: string, root: DialogNode, path: string[]) {
        this.name = name;
        this.root = root;
        this.path = path;
    }
}

export interface ConversationContextType {
    nodes: { [key: string]: DialogNode };
    roots: { [key: string]: DialogRoot };
    createTree: (id: string) => void;
    setTree: (id: string) => void;
    userResponse: (node: DialogNode, response: string, role: "user" | "assistant") => void;
    currentNode: DialogNode;
    setCurrentNode: (node: DialogNode) => void;
    // setDialogTree: (tree: DialogNode) => void;
    saveToFile: () => void;
    loadFromFile: (files: File[]) => void;
    createNode: (parentNode: DialogNode, role: "user" | "assistant", summary: string, response: string) => DialogNode;
    deleteNode: (node: DialogNode) => void;
    resetConversation: () => void;
}