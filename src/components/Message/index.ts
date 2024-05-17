import { createRef } from 'react';
import { Message } from './Message';

const messageService = createRef<Message>();

export { Message, messageService };
