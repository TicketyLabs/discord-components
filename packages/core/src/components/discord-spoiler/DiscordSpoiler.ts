import { consume } from '@lit/context';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { LightTheme } from '../../types.js';
import { messagesLightTheme } from '../discord-messages/DiscordMessages.js';

@customElement('discord-spoiler')
export class DiscordSpoiler extends LitElement implements LightTheme {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		:host {
			background-color: oklab(0.51633 0.00309466 -0.0153829);
			border-radius: 3px;
			color: transparent;
			cursor: pointer;
		}

		:host([light-theme]) {
			background-color: oklab(0.658317 0.00215647 -0.0116118);
		}

		:host(:hover) {
			background-color: oklab(0.621753 0.00217843 -0.0117759);
		}

		:host([light-theme]:hover) {
			background-color: oklab(0.550751 0.00264829 -0.0136494);
		}

		:host([activated]) {
			color: inherit;
			background-color: rgba(151, 151, 159, 0.08);
		}

		:host([light-theme][activated]) {
			background-color: rgba(151, 151, 159, 0.12);
		}
	`;

	@property({ type: Boolean, reflect: true })
	public accessor activated = false;

	/**
	 * Whether to use light theme or not.
	 */
	@consume({ context: messagesLightTheme })
	@property({ type: Boolean, reflect: true, attribute: 'light-theme' })
	public accessor lightTheme = false;

	protected override render() {
		return html`<slot
			@click=${() => {
				this.activated = true;
			}}
			@keydown=${() => {
				this.activated = true;
			}}
		></slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-spoiler': DiscordSpoiler;
	}
}
