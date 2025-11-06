import { consume } from '@lit/context';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { LightTheme } from '../../types.js';
import { messagesLightTheme } from '../discord-messages/DiscordMessages.js';

/**
 * A separator component for dividing content within Discord embed v2 containers.
 * Provides vertical spacing with an optional visual divider line.
 * According to Discord specifications, separators can have different spacing sizes and an optional divider.
 *
 * @example
 * ```html
 * <!-- With divider line (default) -->
 * <discord-separator divider spacing="1"></discord-separator>
 *
 * <!-- Without divider line (spacing only) -->
 * <discord-separator divider="false" spacing="2"></discord-separator>
 * ```
 */
@customElement('discord-separator')
export class DiscordSeparator extends LitElement implements LightTheme {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		:host {
			display: block;
		}

		:host([spacing='1']) {
			margin: 4px 0;
		}

		:host([spacing='2']) {
			margin: 16px 0;
		}

		.discord-separator-line {
			height: 1px;
			background-color: oklab(0.678888 0.00325716 -0.011175 / 0.15);
			border: none;
		}

		:host([light-theme]) .discord-separator-line {
			background-color: oklab(0.678888 0.00325716 -0.011175 / 0.24);
		}

		/* When divider is false, hide the line but keep the spacing */
		:host([divider='false']) .discord-separator-line {
			display: none;
		}
	`;

	/**
	 * The spacing around the separator.
	 * Can be 1 (small: 4px) or 2 (large: 16px).
	 *
	 * @defaultValue 1
	 */
	@property({ type: Number, reflect: true })
	public accessor spacing: 1 | 2 = 1;

	/**
	 * Whether a visual divider line should be displayed.
	 * When false, only the vertical spacing is applied.
	 *
	 * @defaultValue true
	 */
	@property({ type: Boolean, reflect: true })
	public accessor divider = true;

	@consume({ context: messagesLightTheme, subscribe: true })
	@property({ type: Boolean, reflect: true, attribute: 'light-theme' })
	public accessor lightTheme = false;

	protected override render() {
		return html`<hr class="discord-separator-line" />`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-separator': DiscordSeparator;
	}
}
