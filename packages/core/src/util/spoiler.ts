import { css } from 'lit';
import { property } from 'lit/decorators.js';

/**
 * Spoiler state interface
 */
export interface SpoilerState {
	spoiler: boolean;
	spoilerRevealed: boolean;
}

/**
 * Mixin for adding spoiler functionality to components
 */

export function SpoilerMixin<T extends new (...args: any[]) => any>(Base: T) {
	class SpoilerClass extends Base {
		/**
		 * Whether this component should be displayed as a spoiler (blurred until clicked).
		 */
		declare public spoiler: boolean;

		/**
		 * @internal
		 */
		declare public spoilerRevealed: boolean;

		/**
		 * Reveals the spoiler content
		 */
		protected revealSpoiler(): void {
			this.spoilerRevealed = true;
		}

		public constructor(...args: any[]) {
			super(...args);
			this.spoiler = false;
			this.spoilerRevealed = false;
		}
	}

	// Apply property decorators
	property({ type: Boolean, reflect: true })(SpoilerClass.prototype, 'spoiler');
	property({ type: Boolean, reflect: true, attribute: 'spoiler-revealed' })(SpoilerClass.prototype, 'spoilerRevealed');

	return SpoilerClass as T & (new (...args: any[]) => SpoilerState & { revealSpoiler(): void });
}

/**
 * Common CSS styles for spoiler overlays
 */
export const spoilerStyles = css`
	/* Blur effect for spoilered content */
	:host([spoiler]:not([spoiler-revealed])) .spoiler-content {
		filter: blur(44px);
	}

	/* Spoiler overlay */
	.spoiler-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		border-radius: 4px;
		z-index: 1;
	}

	/* Spoiler warning badge */
	.spoiler-warning {
		background-color: rgba(0, 0, 0, 0.9);
		padding: 8px 12px;
		border-radius: 100px;
		font-size: 14px;
		font-weight: 600;
		color: white;
		text-transform: uppercase;
		pointer-events: none;
	}

	/* Small spoiler warning for thumbnails */
	.spoiler-warning-small {
		padding: 4px 8px;
		font-size: 11px;
	}
`;

/**
 * Helper to check if an item should be spoilered based on component or item-level spoiler flags
 *
 * @param componentSpoiler - The component-level spoiler flag
 * @param itemSpoiler - The item-level spoiler flag (optional)
 * @returns Whether the item should be spoilered
 */
export function isItemSpoiler(componentSpoiler: boolean, itemSpoiler?: boolean): boolean {
	return componentSpoiler || itemSpoiler === true;
}
