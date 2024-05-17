import React, { createRef } from 'react';
import { IFocusable } from '../../../interface';
import { Interactable } from '../../Interactable';
import { DICS_HEIGHT } from '../sizes';
import { RodTypes } from '../Rod';
import { Props } from './interface';
import './Disc.css';

export class Disc extends React.PureComponent<Props> implements IFocusable {
    domRef = createRef<HTMLDivElement>();

    currentRod = this.props.currentRod;

    widthPx: number = 0;

    onPress = () => {
        const { onPress, value } = this.props;
        this.activate();
        onPress(value, this.currentRod);
    }

    activate() {
        this.domRef.current!.classList.add('active');
    }

    deactivate() {
        this.domRef.current!.classList.remove('active');
    }

    getValue() {
        return this.props.value;
    }

    update(centerPx: number, bottomPx: number, currentRod: RodTypes) {
        this.currentRod = currentRod;
        this.domRef.current!.style.left = `${centerPx - this.widthPx / 2}px`;
        this.domRef.current!.style.bottom = `${bottomPx + DICS_HEIGHT}px`;
    }

    setWidth(widthPx: number) {
        this.widthPx = widthPx;
        this.domRef.current!.style.width = `${widthPx}px`;
    }

    enableMouseFocus() {
        this.domRef.current!.classList.remove('disable-mouse');
    }

    disableMouseFocus() {
        this.domRef.current!.classList.add('disable-mouse');
    }

    focus() {
        this.domRef.current!.focus();
    }

    hasDom(element: HTMLElement): boolean {
        return element === this.domRef.current;
    }

    render() {
        return (
            <Interactable
                ref={this.domRef}
                className="disc disable-mouse"
                onPress={this.onPress}
            />
        );
    }
}
