import { consume } from '@lit/context';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { LightTheme } from '../../types.js';
import { messagesLightTheme } from '../discord-messages/DiscordMessages.js';

/**
 * A simple text display component for rendering text content within Discord embed v2 containers.
 * This component only renders the text - formatting and styling should be handled by the developer.
 */
@customElement('discord-text-display')
export class DiscordTextDisplay extends LitElement implements LightTheme {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		:host {
			display: block;
			word-break: break-word;
		}

		.discord-text-display-content {
			white-space: pre-wrap;
			overflow-wrap: break-word;
		}
	`;

	@consume({ context: messagesLightTheme, subscribe: true })
	@property({ type: Boolean, reflect: true, attribute: 'light-theme' })
	public accessor lightTheme = false;

	protected override render() {
		return html`<div class="discord-text-display-content"><slot></slot></div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-text-display': DiscordTextDisplay;
	}
}
