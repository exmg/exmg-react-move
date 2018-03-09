import React from 'react';

/**
 *
 */
export const { toArray } = React.Children;

/**
 *
 * @param {Array} current
 * @param {Array} next
 */
export const merge = (current, next) =>
	next.concat(current)
		.filter((element, index, array) =>
			array.findIndex($element => $element.key === element.key) === index);

export const difference = (current, next) => {
	const added = next.filter(item => !current.find(({ key }) => item.key === key));
	const removed = current.filter(item => !next.find(({ key }) => item.key === key));

	return {
		added: added.map(item => item.key),
		removed: removed.map(item => item.key),
	};
};

export const shallowEqualsArray = (a, b) => {
	const { length } = a;

	if (a.length !== b.length) {
		return false;
	}

	for (let i = 0; i < length; i++) {
		if (a[i] !== b[i]) {
			return false;
		}
	}

	return true;
};

