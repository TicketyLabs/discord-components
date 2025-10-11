import { consume } from '@lit/context';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { LightTheme } from '../../types.js';
import { messagesLightTheme } from '../discord-messages/DiscordMessages.js';

/**
 * A section component for organizing content within Discord embed v2 containers.
 * Provides a flex layout with a main content area and an optional accessory area on the right.
 * According to Discord specifications, thumbnails are only supported within sections and are always positioned on the right side.
 * Use the 'accessory' slot to place thumbnails or buttons.
 *
 * @example
 * ```html
 * <discord-section>
 *   <discord-text-display variant="heading">Section Title</discord-text-display>
 *   <discord-text-display>Section content...</discord-text-display>
 *   <discord-thumbnail slot="accessory" url="image.png"></discord-thumbnail>
 * </discord-section>
 * ```
 */
@customElement('discord-section')
export class DiscordSection extends LitElement implements LightTheme {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		:host {
			display: flex;
			flex-direction: row;
			width: 100%;
			max-width: 500px;
		}

		.discord-section-content {
			flex: 1;
			min-width: 0;
		}

		.discord-section-accessory {
			flex-shrink: 0;
			margin-left: 16px;
		}
	`;

	@consume({ context: messagesLightTheme, subscribe: true })
	@property({ type: Boolean, reflect: true, attribute: 'light-theme' })
	public accessor lightTheme = false;

	protected override render() {
		return html`
			<div class="discord-section-content">
				<slot></slot>
			</div>
			<div class="discord-section-accessory">
				<slot name="accessory"></slot>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-section': DiscordSection;
	}
}
