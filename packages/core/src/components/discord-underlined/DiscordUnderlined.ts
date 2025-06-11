import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('discord-underlined')
export class DiscordUnderlined extends LitElement {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		:host {
			display: inline-block;
		}
	`;

	protected override render() {
		return html`
			<u>
				<slot></slot>
			</u>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-underlined': DiscordUnderlined;
	}
}
