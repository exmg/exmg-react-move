import React, { Component, Children } from 'react';
import { findDOMNode } from 'react-dom';
import { polyfill } from 'react-lifecycles-compat';

import { merge, diff, shallowEqualsArray } from './helpers';

export interface MoveProps {
  children?: null | any[];
  /**
   * Duration in milliseconds.
   * Default 220ms
   */
  duration?: number;
  /**
   * CSS Timing function.
   * Default `cubic-bezier(0.4, 0.0, 0.2, 1)`
   */
  timingFunction?: string;
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
  alive: boolean;
}

export interface ChildrenData {
  [key: string]: ChildData;
}

class Move extends Component<MoveProps, MoveState> {
  static defaultProps: Partial<MoveProps> = {
    children: null,
    duration: 220,
    timingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  };

  state: MoveState = {
    children: [],
    remove: [],
    removed: [],
  };

  childrenData: ChildrenData = {};

  static getDerivedStateFromProps(nextProps: MoveProps, prevState: MoveState) {
    // Filter out removed nodes
    const currentChildren = prevState.children
      .filter(({ key }) => prevState.removed.indexOf(key) === -1);
    const nextChildren = Children.toArray(nextProps.children) as JSX.Element[];
    const children = merge(currentChildren, nextChildren);
    const { removed } = diff(currentChildren, nextChildren);

    return {
      children,
      remove: removed,
      removed: [],
    } as MoveState;
  }

  componentDidMount() {
    this.last();
    this.invert();
    this.play();
  }

  componentDidUpdate() {
    this.last();
    this.invert();
    this.play();
  }

  getSnapshotBeforeUpdate() {
    this.first();

    return null;
  }

  shouldComponentUpdate(nextProps: MoveProps, nextState: MoveState) {
    return !shallowEqualsArray(this.state.children, nextState.children)
      || !shallowEqualsArray(this.state.remove, nextState.remove);
  }

  first() {
    this.setPositions('first');
  }

  last() {
    this.setPositions('last');
  }

  invert() {
    const { children } = this.state;

    children.forEach(({ key }) => {
      const data = this.childrenData[key];

      if (!data || !data.node) {
        return;
      }

      const { node, first, last, alive } = data;

      if (alive && last && first) {
        node.style.display = '';
        node.style.transition = 'none';
        node.style.opacity = '1';
        node.style.transform = `translate3d(${first.x - last.x}px, ${first.y - last.y}px, 0) scale(1)`;
      }

      if (!alive && last && first) {
        node.style.transform = `translate3d(${first.x - last.x}px, ${first.y - last.y}px, 0) scale(0)`;
      }
    });
  }

  play() {
    requestAnimationFrame(() => {
      requestAnimationFrame(this.animate);
    });
  }

  animate = () => {
    const { duration, timingFunction } = this.props;
    const { children, remove } = this.state;

    children.forEach(({ key }) => {
      const data = this.childrenData[key];

      if (!data || !data.node || !data.alive) {
        return;
      }

      const { node, first, last } = data;

      node.style.transition = `opacity ${duration}ms, transform ${duration}ms ${timingFunction}`;

      if (remove.indexOf(key) >= 0) {
        this.onTransitionEnd(node, () => {
          this.setState(state => ({ removed: [...state.removed, key] }));
        });

        data.alive = false;

        node.style.opacity = '0';
        node.style.transform = `translate3d(${first!.x - last!.x}px, ${first!.y - last!.y}px, 0) scale(.1)`;
      } else {
        node.style.opacity = '1';
        node.style.transform = 'translate3d(0,0,0) scale(1)';
      }
    });
  }

  onTransitionEnd(node: HTMLElement, callback: () => void) {
    const listener = (event: Event) => {
      if (event.target !== node) {
        return;
      }

      callback();

      node.removeEventListener('transitionend', listener);
    };

    node.addEventListener('transitionend', listener);
  }

  setPositions(type: 'first' | 'last') {
    const { children } = this.state;

    children.forEach(({ key }) => {
      const data = this.childrenData[key];

      if (!data || !data.node) {
        return;
      }

      // Reset styles for 'last' to set correct ending position
      if (type === 'last') {
        data.node.style.transition = 'none';
        data.node.style.transform = 'translate3d(0,0,0) scale(1)';
      }

      data[type] = data.node.getBoundingClientRect() as DOMRect;
    });
  }

  addNode = (key: any) => (element: HTMLElement) => {
    // eslint-disable-next-line react/no-find-dom-node
    const node = findDOMNode(element) as HTMLElement;

    if (!node) {
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      throw new Error(`Expected ELEMENT_NODE`);
    }

    if (!this.childrenData[key]) {
      // Initial styling
      node.style.transform = 'translate3d(0,0,0) scale(0)';

      this.childrenData[key] = { node, alive: true };
    }
  }

  renderComponent = (component: JSX.Element) =>
    React.cloneElement(component, { ref: this.addNode(component.key) })

  render() {
    return this.state.children.map(this.renderComponent);
  }
}

polyfill(Move);

export default Move;
