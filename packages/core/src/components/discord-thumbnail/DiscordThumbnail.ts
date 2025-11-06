import { consume } from '@lit/context';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { LightTheme } from '../../types.js';
import { SpoilerMixin } from '../../util/spoiler.js';
import { messagesLightTheme } from '../discord-messages/DiscordMessages.js';

/**
 * A thumbnail component for displaying small preview images within Discord embed v2 sections.
 * According to Discord specifications, thumbnails are only supported within sections and are always positioned on the right side.
 * Use the 'accessory' slot in discord-section to place thumbnails.
 */
@customElement('discord-thumbnail')
export class DiscordThumbnail extends SpoilerMixin(LitElement) implements LightTheme {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		:host {
			display: block;
			border-radius: 4px;
			flex-shrink: 0;
			overflow: hidden;
			position: relative;
		}

		.discord-thumbnail-image {
			border-radius: 4px;
			max-height: 80px;
			max-width: 80px;
			object-fit: contain;
			object-position: top center;
			display: block;
		}

		:host([size='small']) .discord-thumbnail-image {
			max-height: 60px;
			max-width: 60px;
		}

		:host([size='large']) .discord-thumbnail-image {
			max-height: 120px;
			max-width: 120px;
		}

		::slotted(img) {
			border-radius: 4px;
			max-height: 80px;
			max-width: 80px;
			object-fit: contain;
			object-position: top center;
			display: block;
		}

		:host([size='small']) ::slotted(img) {
			max-height: 60px;
			max-width: 60px;
		}

		:host([size='large']) ::slotted(img) {
			max-height: 120px;
			max-width: 120px;
		}

		/* Spoiler styles */
		:host([spoiler]:not([spoiler-revealed])) .discord-thumbnail-image,
		:host([spoiler]:not([spoiler-revealed])) ::slotted(img) {
			filter: blur(44px);
		}

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
		}

		.spoiler-warning {
			background-color: rgba(0, 0, 0, 0.9);
			padding: 4px 8px;
			border-radius: 100px;
			font-size: 11px;
			font-weight: 600;
			color: white;
			text-transform: uppercase;
			pointer-events: none;
		}
	`;

	/**
	 * The URL of the thumbnail image.
	 */
	@property({ type: String, reflect: true })
	public accessor url: string | undefined = undefined;

	/**
	 * The size of the thumbnail.
	 * Can be "small", "medium" (default), or "large".
	 */
	@property({ type: String, reflect: true })
	public accessor size: 'large' | 'medium' | 'small' = 'medium';

	/**
	 * Alt text for the thumbnail image.
	 */
	@property({ type: String, reflect: true })
	public accessor alt: string | undefined = undefined;

	@consume({ context: messagesLightTheme, subscribe: true })
	@property({ type: Boolean, reflect: true, attribute: 'light-theme' })
	public accessor lightTheme = false;

	protected override render() {
		const content = this.url
			? html`<img src=${ifDefined(this.url)} alt=${ifDefined(this.alt)} class="discord-thumbnail-image" />`
			: html`<slot></slot>`;

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
		'discord-thumbnail': DiscordThumbnail;
	}
}
