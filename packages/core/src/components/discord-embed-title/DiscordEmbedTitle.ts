import { consume } from '@lit/context';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { LightTheme } from '../../types.js';
import { messagesLightTheme } from '../discord-messages/DiscordMessages.js';

@customElement('discord-embed-title')
export class DiscordEmbedTitle extends LitElement implements LightTheme {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		:host {
			-webkit-box-align: center;
			align-items: center;
			color: #fff;
			display: inline-block;
			font-size: 1rem;
			font-weight: 600;
			grid-column: 1 / 1;
			margin-top: 8px;
			min-width: 0;
		}

		:host([light-theme]) {
			color: #060607;
		}

		:host a {
			color: #00aff4;
			font-weight: 600;
			text-decoration: none;
		}

		:host a:hover {
			text-decoration: underline;
		}
	`;

	/**
	 * The URL to open when you click on the embed title.
	 */
	@property()
	public accessor url: string;

	@consume({ context: messagesLightTheme, subscribe: true })
	@property({ type: Boolean, reflect: true, attribute: 'light-theme' })
	public accessor lightTheme = false;

	protected override render() {
		return this.url
			? html`<a href="${this.url}" target="_blank" rel="noopener noreferrer">
					<slot></slot>
				</a>`
			: html`<slot></slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-embed-title': DiscordEmbedTitle;
	}
}
