/// <reference types="react" />
import * as React from 'react';
export interface MoveProps {
    children?: JSX.Element | JSX.Element[];
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
declare class Move extends React.Component<MoveProps, MoveState> {
    static defaultProps: {
        children: any;
    };
    state: {
        children: any[];
        remove: any[];
        removed: any[];
    };
    childrenData: ChildrenData;
    static getDerivedStateFromProps(nextProps: any, prevState: any): {
        children: any;
        remove: any;
        removed: any[];
    };
    componentDidMount(): void;
    componentDidUpdate(): void;
    getSnapshotBeforeUpdate(): any;
    shouldComponentUpdate(nextProps: any, nextState: any): boolean;
    first(): void;
    last(): void;
    invert(): void;
    play(): void;
    animate: () => void;
    onTransitionEnd(node: any, callback: any): void;
    setPositions(type: any): void;
    addNode: (key: any) => (element: HTMLElement) => void;
    renderComponent: (component: any) => React.SFCElement<{
        ref: (element: HTMLElement) => void;
    }>;
    render(): React.SFCElement<{
        ref: (element: HTMLElement) => void;
    }>[];
}
export default Move;
