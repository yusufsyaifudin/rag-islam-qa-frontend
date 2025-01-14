interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export default Message;
