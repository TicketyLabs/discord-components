import { consume } from '@lit/context';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { LightTheme } from '../../types.js';
import { messagesLightTheme } from '../discord-messages/DiscordMessages.js';

@customElement('discord-embed-field')
export class DiscordEmbedField extends LitElement implements LightTheme {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		:host {
			font-size: 0.875rem;
			line-height: 1.125rem;
			min-width: 0;
			font-weight: 400;
			grid-column: 1/13;
			word-break: break-word;
		}

		:host .discord-inline-field {
			flex-grow: 1;
			flex-basis: auto;
			min-width: 150px;
		}
	`;

	/**
	 * Whether this field should be displayed inline or not.
	 */
	@property({ type: Boolean, reflect: true, attribute: 'inline' })
	public accessor inline = false;

	/**
	 * The index of this inline field
	 *
	 * @remarks
	 * - This defines the position of this inline field. 1 is left, 2 is middle and 3 is right.
	 * - one of `[1, 2, 3]`
	 * @defaultValue 1
	 */
	@property({ type: Number, reflect: true, attribute: 'inline-index' })
	public accessor inlineIndex: number | undefined = undefined;

	@consume({ context: messagesLightTheme, subscribe: true })
	@property({ type: Boolean, reflect: true, attribute: 'light-theme' })
	public accessor lightTheme = false;

	private readonly validInlineIndices = new Set([1, 2, 3]);

	public checkInlineIndex() {
		if (this.inlineIndex) {
			const inlineIndexAsNumber = Number(this.inlineIndex);
			if (!Number.isNaN(inlineIndexAsNumber) && !this.validInlineIndices.has(inlineIndexAsNumber)) {
				throw new RangeError('DiscordEmbedField `inlineIndex` prop must be one of: 1, 2, or 3');
			}
		}
	}

	protected override render() {
		this.checkInlineIndex();

		return html`
			<slot name="field-title"></slot>
			<slot></slot>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-embed-field': DiscordEmbedField;
	}
}
