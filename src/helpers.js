import React from 'react';

export const toArray = elements =>
	React.Children.toArray(elements);

export const merge = (current, next) =>
	next.concat(current)
		.filter((element, index, array) =>
			array.findIndex($element => $element.key === element.key) === index,
		);

export const difference = (current, next) => {
	const added = next.filter(item => !current.find(({ key }) => item.key === key));
	const removed = current.filter(item => !next.find(({ key }) => item.key === key));

	return {
		added: added.map(item => item.key),
		removed: removed.map(item => item.key),
	};
};
