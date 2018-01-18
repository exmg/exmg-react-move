import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';

import { toArray, merge, difference } from './helpers';

export default class Flip extends Component {
	static propTypes = {
		children: PropTypes.node,
	};

	static defaultProps = {
		children: null,
	};

	state = {
		children: null,
	};

	// eslint-disable-next-line react/sort-comp
	childrenData = {};
	createQueue = [];
	removeQueue = [];
	removed = [];

	componentWillMount() {
		const { children } = this.props;

		this.setState({ children: toArray(children) });
	}

	componentWillReceiveProps(nextProps) {
		const currentChildren = this.state.children.filter(child => this.removed.indexOf(child.key) === -1);
		const nextChildren = toArray(nextProps.children);
		const children = merge(currentChildren, nextChildren);
		const { added, removed } = difference(currentChildren, nextChildren);

		this.createQueue = added;
		this.removeQueue = removed;
		this.removed.length = 0;

		this.setPositions('first');

		this.setState({ children });
	}

	componentDidUpdate() {
		this.setPositions('last');
		this.invert();
		this.play();
	}

	setPositions(dataKey) {
		const { children } = this.state;
		const { childrenData } = this;

		children.forEach(({ key }) => {
			const data = childrenData[key];

			if (!data || !data.node) {
				return;
			}

			data.node.style.display = '';
			data[dataKey] = data.node.getBoundingClientRect();
		});
	}

	invert() {
		const { children } = this.state;
		const { childrenData } = this;

		children.forEach(({ key }) => {
			const data = childrenData[key];
			const { node, first, last } = data;

			if (this.createQueue.indexOf(key) >= 0) {
				node.style.opacity = 0;
				node.style.transform = `scale(0)`;
			} else {
				data.transform = `translate3d(${first.x - last.x}px, ${first.y - last.y}px, 0)`;

				node.style.opacity = 1;
				node.style.display = '';
				node.style.transition = 'none';
				node.style.transform = data.transform;
			}
		});
	}

	play() {
		const { children } = this.state;

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				children.forEach(({ key }) => {
					const data = this.childrenData[key];

					if (!data || !data.node) {
						return;
					}

					const { node, transform } = data;

					node.style.transition = 'opacity 160ms, transform 260ms ease-out';

					if (this.createQueue.indexOf(key) >= 0) {
						node.style.opacity = 1;
						node.style.transform = `scale(1)`;
					} else if (this.removeQueue.indexOf(key) >= 0) {
						node.style.opacity = 0;
						node.style.transform = `${transform} scale(0.1)`;

						this.addEndedListener(key);
					} else {
						node.style.opacity = 1;
						node.style.transform = `translate3d(0, 0, 0)`;
					}
				});
			});
		});
	}

	addEndedListener(key) {
		const { node } = this.childrenData[key];

		const listener = (event) => {
			const isLeaving = this.removeQueue.indexOf(key);

			if (event.propertyName === 'opacity' && isLeaving >= 0) {
				delete this.childrenData[key];
				this.removed.push(key);

				node.style.display = 'none';
				node.style.transform = '';

				node.removeEventListener('transitionend', listener);
			}
		};

		node.addEventListener('transitionend', listener);
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

		// 'Hide' removed nodes
		if (this.removeQueue.indexOf(key) >= 0) {
			node.style.display = 'none';
		} else {
			node.style.display = '';
		}

		this.childrenData[key] = {
			...this.childrenData[key],
			node,
			key,
		};
	}

	renderComponent = (component) => {
		const { key } = component;

		return React.cloneElement(component, { ref: this.addNode(key) });
	}

	render() {
		const { children } = this.state;

		return children.map(this.renderComponent);
	}
}
