import React, { createRef } from 'react';
import { Interactable } from '../Interactable';
import { MessageOptions } from './interface';
import './Message.css';
import { TRANSLATIONS } from '../../translations';

export class Message extends React.PureComponent {

    domRef = createRef<HTMLDivElement>();

    confirmButton = createRef<HTMLDivElement>();

    title = createRef<HTMLDivElement>();

    text = createRef<HTMLDivElement>();

    lastActiveElement: HTMLElement | null = null;

    isOpen = false;

    confirmCallback: (() => void) | undefined = undefined;

    onConfirm = () => {
        this.isOpen = false;
        this.hide();
        this.lastActiveElement?.focus();
        this.confirmCallback?.();
    }

    open(options: MessageOptions) {
        if (this.isOpen) return;
        const { title, text, onConfirm } = options;
        this.isOpen = true;
        this.title.current!.textContent = title;
        this.text.current!.textContent = text;
        this.lastActiveElement = document.activeElement as HTMLElement;
        this.confirmCallback = onConfirm;
        this.show();
        this.confirmButton.current!.focus();
    }

    show() {
        this.domRef.current!.classList.add('visible');
    }

    hide() {
        this.domRef.current!.classList.remove('visible');
    }

    render() {
        return (
            <div ref={this.domRef} className="message">
                <div ref={this.title} className="title" />
                <div ref={this.text} className="text" />
                <Interactable
                    ref={this.confirmButton}
                    className="button"
                    onPress={this.onConfirm}
                >
                    {TRANSLATIONS.ok}
                </Interactable>
            </div>
        );
    }
}
