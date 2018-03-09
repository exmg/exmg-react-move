import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';

import { toArray, merge, difference, shallowEqualsArray } from './helpers';

export default class Move extends Component {
	static propTypes = {
		children: PropTypes.node,
	};

	static defaultProps = {
		children: null,
	};

	state = {
		children: [],
		remove: [],
		childrenData: {},
	};

	childrenData = {};

	static getDerivedStateFromProps(nextProps, prevState) {
		const currentChildren = prevState.children; // .filter(child => prevProps.removed.indexOf(child.key) === -1);
		const nextChildren = toArray(nextProps.children);
		const children = merge(currentChildren, nextChildren);
		const { added, removed } = difference(currentChildren, nextChildren);

		// filter children by childrenData[key].removed === true?

		return {
			children,
			add: added,
			remove: removed,
		};
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

	shouldComponentUpdate(nextProps, nextState) {
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

			const { node, first, last } = data;

			if (last && first) {
				// Reset display for elements to be removed
				node.style.display = '';
				node.style.transition = 'none';
				node.style.opacity = 1;
				node.style.transform = `translate3d(${first.x - last.x}px, ${first.y - last.y}px, 0) scale(1)`;
			}
		});
	}

	play() {
		const { children, remove } = this.state;

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				children.forEach(({ key }) => {
					const data = this.childrenData[key];

					if (!data || !data.node) {
						return;
					}

					const { node, first, last } = data;

					node.style.transition = 'opacity 220ms, transform 220ms ease-out';

					/* if (add.indexOf(key) >= 0) {
						node.style.opacity = 1;
						node.style.transform = `scale(1) translate3d(0,0,0) `;
					} else */
					if (remove.indexOf(key) >= 0) {
						node.style.opacity = 0;
						node.style.transform = `translate3d(${first.x - last.x}px, ${first.y - last.y}px, 0) scale(.1)`;
					} else {
						node.style.opacity = 1;
						node.style.transform = 'translate3d(0,0,0) scale(1)';
					}
				});
			});
		});
	}

	setPositions(type) {
		const { children } = this.state;

		children.forEach(({ key }) => {
			const data = this.childrenData[key];

			if (!data || !data.node) {
				return;
			}

			// data.node.style.display = '';
			data[type] = data.node.getBoundingClientRect();
		});
	}

	addNode = key => (element) => {
		// eslint-disable-next-line react/no-find-dom-node
		const node = findDOMNode(element);

		if (!node) {
			return;
		}

		if (node.nodeType !== Node.ELEMENT_NODE) {
			throw new Error(`Expected ELEMENT_NODE`);
		}

		const { childrenData } = this.state;

		if (!this.childrenData[key]) {
			// Initial styling
			node.style.transform = 'translate3d(0,0,0) scale(0)';
		}

		// setState updates state async, so also store as class prop..
		this.childrenData = {
			...this.childrenData,
			[key]: {
				...this.childrenData[key],
				node,
			},
		};

		this.setState({ childrenData });
	}

	renderComponent = component =>
		React.cloneElement(component, { ref: this.addNode(component.key) })

	render() {
		// aka componentWillUpdate
		this.first();

		return this.state.children.map(this.renderComponent);
	}
}
