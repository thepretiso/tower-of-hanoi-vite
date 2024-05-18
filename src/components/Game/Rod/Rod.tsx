import React, { createRef } from 'react';
import { IFocusable } from '../../../interface';
import { Interactable } from '../../Interactable';
import { Props } from './interface';
import { Disc } from '../Disc';
import { DICS_HEIGHT, DISC_GAP, DISC_ROD_BOTTOM, ROD_DIMENSIONS } from '../sizes';
import './Rod.css';

export class Rod extends React.PureComponent<Props> implements IFocusable {
    domRef = createRef<HTMLDivElement>();

    discRefs: React.RefObject<Disc>[] = [];

    onPress = () => {
        const { onPress, type } = this.props;
        onPress(type);
    }

    getTopDisc(): React.RefObject<Disc> | undefined {
        if (!this.discRefs.length) return undefined;
        return this.discRefs[this.discRefs.length - 1];
    }

    getDiscRefs() {
        return this.discRefs;
    }

    pushDisc(disc: React.RefObject<Disc>): boolean {
        const discsLength = this.discRefs.length;
        if (
            discsLength === 0 ||
            this.discRefs[discsLength - 1].current!.getValue() > disc.current!.getValue()
        ) {
            this.discRefs.push(disc);
            this.updateDisc(disc, discsLength - 1);
            return true;
        }
        return false;
    }

    popDisc(): React.RefObject<Disc> | undefined {
        return this.discRefs.pop();
    }

    clear() {
        this.discRefs = [];
    }

    updateDisc(disc: React.RefObject<Disc>, positionIndex: number) {
        const { type } = this.props;
        const { centerPx, bottomPx } = ROD_DIMENSIONS[type];
        const discBottomPx = bottomPx + DISC_ROD_BOTTOM + positionIndex * (DICS_HEIGHT + DISC_GAP);
        disc.current!.update(centerPx, discBottomPx, type);
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
        const { type } = this.props;
        const dimensions = ROD_DIMENSIONS[type];
        return (
            <Interactable
                ref={this.domRef}
                className="rod disable-mouse"
                onPress={this.onPress}
                style={{
                    left: `${dimensions.centerPx - dimensions.widthPx / 2}px`,
                    bottom: `${dimensions.bottomPx}px`,
                }}
            />
        );
    }
}
