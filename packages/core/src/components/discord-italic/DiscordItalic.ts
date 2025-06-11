import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('discord-italic')
export class DiscordItalic extends LitElement {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		:host {
			display: inline-block;
		}
		:host > em {
			font-style: italic;
		}
	`;

	protected override render() {
		return html`
			<em>
				<slot></slot>
			</em>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-italic': DiscordItalic;
	}
}
