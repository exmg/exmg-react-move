/// <reference types="react" />
import React, { Component } from 'react';
export interface MoveProps {
    children?: JSX.Element[];
    duration: number;
    timingFunction: string;
}
export interface MoveState {
    children: any[];
    remove: any[];
    removed: any[];
}
export interface ChildData {
    node: HTMLElement;
    first?: DOMRect;
    last?: DOMRect;
}
export interface ChildrenData {
    [key: string]: ChildData;
}
declare class Move extends Component<MoveProps, MoveState> {
    static defaultProps: Partial<MoveProps>;
    state: MoveState;
    childrenData: ChildrenData;
    static getDerivedStateFromProps(nextProps: MoveProps, prevState: MoveState): MoveState;
    componentDidMount(): void;
    componentDidUpdate(): void;
    getSnapshotBeforeUpdate(): void;
    shouldComponentUpdate(nextProps: MoveProps, nextState: MoveState): boolean;
    first(): void;
    last(): void;
    invert(): void;
    play(): void;
    animate: () => void;
    onTransitionEnd(node: HTMLElement, callback: () => void): void;
    setPositions(type: 'first' | 'last'): void;
    addNode: (key: any) => (element: HTMLElement) => void;
    renderComponent: (component: JSX.Element) => React.ReactElement<any>;
    render(): React.ReactElement<any>[];
}
export default Move;
