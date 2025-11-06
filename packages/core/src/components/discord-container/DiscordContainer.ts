import { consume } from '@lit/context';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import type { LightTheme } from '../../types.js';
import { SpoilerMixin } from '../../util/spoiler.js';
import { messagesLightTheme } from '../discord-messages/DiscordMessages.js';

/**
 * A container component for Discord embed v2 components.
 * This wraps embed content and provides two different styling modes:
 * - Without color: Renders as a simple rounded box with a thin outline (components v2 style)
 * - With color: Renders with a colored left border like traditional Discord embeds
 *
 * @example
 * ```html
 * <!-- Components v2 style (no color) - rounded box with outline -->
 * <discord-container>
 *   <discord-section>
 *     <discord-text-display variant="heading">Title</discord-text-display>
 *   </discord-section>
 * </discord-container>
 *
 * <!-- Traditional embed style (with color) - colored left border -->
 * <discord-container color="#5865F2">
 *   <discord-section>
 *     <discord-text-display variant="heading">Embed Title</discord-text-display>
 *   </discord-section>
 * </discord-container>
 * ```
 */
@customElement('discord-container')
export class DiscordContainer extends SpoilerMixin(LitElement) implements LightTheme {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		:host {
			color: oklab(0.952331 0.000418991 -0.00125992);
			display: block;
			font-size: 13px;
			line-height: 150%;
			margin-bottom: 8px;
			margin-top: 8px;
		}

		:host([light-theme]) {
			color: oklab(0.322425 0.00154591 -0.010555);
		}

		/* Container with no color - simple rounded box with thin outline */
		.discord-container-wrapper {
			background-color: oklab(0.262384 0.00252247 -0.00889932);
			max-width: 520px;
			border: 1px solid oklab(0.678888 0.00325716 -0.011175 / 0.121569);
			border-radius: 4px;
			display: grid;
			box-sizing: border-box;
			padding: 0.5rem 1rem 1rem 0.75rem;
		}

		:host([light-theme]) .discord-container-wrapper {
			background-color: oklab(0.999994 0.0000455678 0.0000200868);
			border-color: oklab(0.678888 0.00325716 -0.011175 / 0.278431);
		}

		/* Container with color - traditional embed style with colored left border */
		:host([color]) .discord-container-root {
			display: flex;
		}

		:host([color]) .discord-container-left-border {
			width: 4px;
			border-radius: 4px 0 0 4px;
			flex-shrink: 0;
		}

		:host([color]) .discord-container-wrapper {
			border-radius: 0 4px 4px 0;
			border-left: none;
		}

		/* Spoiler styles */
		:host([spoiler]:not([spoiler-revealed])) .discord-container-wrapper {
			filter: blur(44px);
			cursor: pointer;
		}

		.spoiler-overlay {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			max-width: 520px;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.6);
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			border-radius: 4px;
			z-index: 1;
		}

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

		:host([spoiler]) {
			position: relative;
		}
	`;

	/**
	 * The color to use for the container's left border (optional).
	 * Can be any [CSS color value](https://www.w3schools.com/cssref/css_colors_legal.asp).
	 * - If provided: Renders as a traditional Discord embed with a colored left border
	 * - If not provided: Renders as a components v2 style rounded box with a thin outline
	 */
	@property({ type: String, reflect: true })
	public accessor color: string | undefined = undefined;

	@consume({ context: messagesLightTheme, subscribe: true })
	@property({ type: Boolean, reflect: true, attribute: 'light-theme' })
	public accessor lightTheme = false;

	protected override render() {
		let content;

		// If color is provided, render with colored left border (traditional embed style)
		if (this.color) {
			content = html`
				<div class="discord-container-root">
					<div class="discord-container-left-border" style=${styleMap({ 'background-color': this.color })}></div>
					<div class="discord-container-wrapper">
						<slot></slot>
					</div>
				</div>
			`;
		} else {
			// If no color, render as simple rounded box with thin outline
			content = html`
				<div class="discord-container-wrapper">
					<slot></slot>
				</div>
			`;
		}

		// Add spoiler overlay if spoiler is enabled and not revealed
		if (this.spoiler && !this.spoilerRevealed) {
			return html`
				${content}
				<div class="spoiler-overlay" @click=${this.revealSpoiler} @keydown=${this.revealSpoiler}>
					<span class="spoiler-warning">Spoiler</span>
				</div>
			`;
		}

		return content;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-container': DiscordContainer;
	}
}
