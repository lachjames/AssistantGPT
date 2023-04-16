import { createContext, useContext } from 'react';
import { ConversationContextType } from './types';

export const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const useConversation = () => {
    const context = useContext(ConversationContext);
    if (!context) {
        throw new Error('useConversation must be used within a ConversationProvider');
    }
    return context;
};