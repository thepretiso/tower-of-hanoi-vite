import React, { KeyboardEvent, createRef } from 'react';
import { stopEvent } from '../../utils/stopEvent';
import { IFocusable } from '../../interface';
import { NavigationType, Props } from './interface';

export class Navigation extends React.PureComponent<Props> implements IFocusable {
    focusableChildren: React.RefObject<IFocusable>[] = [];

    domRef = createRef<HTMLDivElement>();

    focusIndex = 0;

    componentDidMount(): void {
        const { focusableChildren } = this.props;
        this.updateFocusableChildren(focusableChildren);
    }

    focusNext(event: KeyboardEvent<HTMLDivElement>) {
        const fromIndex = this.getTargetIndex(event.target as HTMLElement);
        if (fromIndex < this.focusableChildren.length - 1) {
            this.setFocusIndex(fromIndex + 1);
            this.focusCurrentIndex();
            stopEvent(event);
        }
    }

    focusPrevious(event: KeyboardEvent<HTMLDivElement>) {
        const fromIndex = this.getTargetIndex(event.target as HTMLElement);
        if (fromIndex > 0) {
            this.setFocusIndex(fromIndex - 1);
            this.focusCurrentIndex();
            stopEvent(event);
        }
    }

    onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const { navigationType } = this.props;
        if (navigationType === NavigationType.HORIZONTAL) {
            if (event.code === 'ArrowLeft') this.focusPrevious(event);
            else if (event.code === 'ArrowRight') this.focusNext(event);
        } else if (navigationType === NavigationType.VERTICAL) {
            if (event.code === 'ArrowUp') this.focusPrevious(event);
            else if (event.code === 'ArrowDown') this.focusNext(event);
        }
    }

    getTargetIndex(target: HTMLElement) {
        const { focusableChildren } = this;
        if (
            focusableChildren[this.focusIndex]
            && focusableChildren[this.focusIndex].current === target
        ) {
            return this.focusIndex;
        }
        const targetIndex = focusableChildren.findIndex(({ current }) => (
            current === target || current?.hasDom?.(target)
        ));
        return targetIndex !== -1 ? targetIndex : this.focusIndex;
    }

    setFocusIndex(index: number) {
        if (index >= 0 && index < this.focusableChildren.length) {
            this.focusIndex = index;
        }
    }

    updateFocusableChildren(newChildren: React.RefObject<IFocusable>[]) {
        const previousFocusIndex = this.getTargetIndex(document.activeElement as HTMLElement);
        this.focusableChildren.splice(0);
        if (newChildren.length) {
            this.focusableChildren.push(...newChildren);
            this.focusIndex = Math.min(previousFocusIndex, this.focusableChildren.length - 1);
        }
    }

    focusCurrentIndex() {
        const element = this.focusableChildren[this.focusIndex];
        if (element) {
            if (!element.current || typeof element.current.focus !== 'function') {
                throw new Error('Not a focusable child');
            }
            element.current?.focus();
        }
    }

    focusChild(child: React.RefObject<IFocusable>) {
        const childIndex = this.focusableChildren.indexOf(child);
        if (childIndex !== -1) {
            this.setFocusIndex(childIndex);
            this.focusCurrentIndex();
        }
    }

    focus() {
        this.focusCurrentIndex();
    }

    render() {
        const { children, className } = this.props;
        return (
            <div
                ref={this.domRef}
                onKeyDown={this.onKeyDown}
                tabIndex={0}
                className={className || ''}
            >
                {children}
            </div>
        )
    }
}
