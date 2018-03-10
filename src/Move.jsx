import React, { Component, Children } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { merge, diff, shallowEqualsArray } from './helpers';

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
		removed: [],
	};

	childrenData = {};

	static getDerivedStateFromProps(nextProps, prevState) {
		// Filter out removed nodes
		const currentChildren = prevState.children
			.filter(({ key }) => prevState.removed.indexOf(key) === -1);
		const nextChildren = Children.toArray(nextProps.children);
		const children = merge(currentChildren, nextChildren);
		const { added, removed } = diff(currentChildren, nextChildren);

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
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				const { children, remove } = this.state;

				children.forEach(({ key }) => {
					const data = this.childrenData[key];

					if (!data || !data.node) {
						return;
					}

					const { node, first, last } = data;


					if (remove.indexOf(key) >= 0) {
						this.onTransitionEnd(node, () => {
							this.setState(state => ({ removed: [...state.removed, key] }));
						});

						node.style.transition = 'opacity 220ms, transform 220ms ease-out';
						node.style.opacity = 0;
						node.style.transform = `translate3d(${first.x - last.x}px, ${first.y - last.y}px, 0) scale(.1)`;
					} else {
						node.style.transition = 'opacity 220ms, transform 220ms cubic-bezier(0.770, 0, 0.175, 1)';
						node.style.opacity = 1;
						node.style.transform = 'translate3d(0,0,0) scale(1)';
					}
				});
			});
		});
	}

	onTransitionEnd(node, callback) {
		const listener = () => {
			callback();

			node.removeEventListener('transitionend', listener);
		};

		node.addEventListener('transitionend', listener);
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

		if (!this.childrenData[key]) {
			// Initial styling
			node.style.transform = 'translate3d(0,0,0) scale(0)';

			this.childrenData[key] = { node };
		}
	}

	renderComponent = component =>
		React.cloneElement(component, { ref: this.addNode(component.key) })

	render() {
		this.first();

		return this.state.children.map(this.renderComponent);
	}
}
