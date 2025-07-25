import { consume } from '@lit/context';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';
import type { LightTheme } from '../../types.js';
import { messagesLightTheme } from '../discord-messages/DiscordMessages.js';

@customElement('discord-embed')
export class DiscordEmbed extends LitElement implements LightTheme {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		:host {
			color: oklab(0.952331 0.000418991 -0.00125992);
			display: flex;
			font-size: 13px;
			line-height: 150%;
			margin-bottom: 8px;
			margin-top: 8px;
		}

		:host([light-theme]) {
			color: oklab(0.322425 0.00154591 -0.010555);
		}

		:host .discord-embed-root {
			display: grid;
			grid-auto-flow: row;
			grid-row-gap: 0.25rem;
			min-height: 0;
			min-width: 0;
			text-indent: 0;
			border-left: 4px solid oklab(0.678888 0.00325716 -0.011175 / 0.2);
			border-radius: 4px 0 0 4px;
		}

		:host([light-theme]) .discord-embed-root {
			border-left-color: oklab(0.678888 0.00325716 -0.011175 / 0.360784);
		}

		:host .discord-embed-wrapper {
			background-color: oklab(0.262384 0.00252247 -0.00889932);
			max-width: 520px;
			border: 1px solid oklab(0.678888 0.00325716 -0.011175 / 0.121569);
			border-radius: 0 4px 4px 0;
			justify-self: start;
			align-self: start;
			display: grid;
			box-sizing: border-box;
		}

		:host([light-theme]) .discord-embed-wrapper {
			background-color: oklab(0.999994 0.0000455678 0.0000200868);
			border-color: oklab(0.678888 0.00325716 -0.011175 / 0.278431);
		}

		:host .discord-embed-wrapper .discord-embed-grid {
			display: inline-grid;
			grid-template-columns: auto -webkit-min-content;
			grid-template-columns: auto min-content;
			grid-template-columns: auto;
			grid-template-rows: auto;
			padding: 0.5rem 1rem 1rem 0.75rem;
		}

		:host .discord-embed-thumbnail {
			border-radius: 4px;
			flex-shrink: 0;
			grid-column: 2/2;
			grid-row: 1/8;
			justify-self: end;
			margin-left: 16px;
			margin-top: 8px;
			max-height: 80px;
			max-width: 80px;
			object-fit: contain;
			object-position: top center;
		}

		:host .discord-embed-author {
			-webkit-box-align: center;
			align-items: center;
			color: #fff;
			font-size: 14px;
			display: flex;
			font-weight: 600;
			grid-column: 1 / 1;
			margin-top: 8px;
			min-width: 0;
		}

		:host([light-theme]) .discord-embed-author {
			color: #060607;
		}

		:host .discord-embed-author a {
			color: #fff;
			font-weight: 600;
			text-decoration: none;
		}

		:host .discord-embed-author a:hover {
			text-decoration: underline;
		}

		:host([light-theme]) .discord-embed-author a {
			color: #060607;
		}

		:host .discord-embed-author .discord-author-image {
			border-radius: 50%;
			height: 24px;
			margin-right: 8px;
			width: 24px;
		}

		:host .discord-embed-author-block,
		:host .discord-embed-author-block > span {
			max-width: 95%;
		}

		:host .discord-embed-provider {
			font-size: 0.75rem;
			line-height: 1rem;
			font-weight: 400;
			grid-column: 1/1;
			margin-top: 8px;
			unicode-bidi: plaintext;
			text-align: left;
		}

		:host([light-theme]) .discord-embed-provider {
			color: #4f545c;
		}

		:host .discord-embed-image {
			border-radius: 4px;
			max-width: 300px;
			max-height: 300px;
		}

		:host .discord-embed-media {
			border-radius: 4px;
			contain: paint;
			display: block;
			grid-column: 1/1;
			margin-top: 16px;
		}

		:host .discord-embed-media.discord-embed-media-video {
			height: 225px;
		}

		:host .discord-embed.media .discord-embed-image {
			overflow: hidden;
			position: relative;
			user-select: text;
		}

		:host .discord-embed-media .discord-embed-video {
			-webkit-box-align: center;
			-webkit-box-pack: center;
			align-items: center;
			border-radius: 0;
			cursor: pointer;
			display: flex;
			height: 100%;
			justify-content: center;
			max-height: 100%;
			width: 100%;

			width: 400px;
			height: 225px;
			left: 0px;
			top: 0px;
		}

		.discord-embed-custom-emoji {
			display: inline-block;
		}

		.discord-embed-custom-emoji .discord-embed-custom-emoji-image {
			width: 18px;
			height: 18px;
			vertical-align: bottom;
		}

		slot[name='footer']::slotted(*) {
			grid-column: 1/3;
			grid-row: auto/auto;
		}
	`;

	/**
	 * The color to use for the embed's left border.
	 * Can be any [CSS color value](https://www.w3schools.com/cssref/css_colors_legal.asp).
	 */
	@property()
	public accessor color: string;

	/**
	 * The author's name.
	 */
	@property({ attribute: 'author-name' })
	public accessor authorName: string;

	/**
	 * The author's avatar URL.
	 */
	@property({ attribute: 'author-image' })
	public accessor authorImage: string;

	/**
	 * The URL to open when you click on the author's name.
	 */
	@property({ attribute: 'author-url' })
	public accessor authorUrl: string;

	/**
	 * The thumbnail image to use.
	 */
	@property()
	public accessor thumbnail: string;

	/**
	 * The embed image to use (displayed at the bottom).
	 */
	@property()
	public accessor image: string;

	/**
	 * The embed video to use (displayed at the bottom, same slot as the image).
	 *
	 * @remarks
	 * - YouTube videos will not be playable on your projects, this is due to YouTube using DASH to play their videos rather
	 * than providing the raw media stream (in a container such as mp4 or ogg). Links to regular MP4 files (such as on a CDN) however
	 * will autoplay!
	 * - Video takes priority over image.
	 * - Providing both a video and an image will ensure the image is shown to users with browsers
	 * that do not support HTML5 video playback.
	 * @example https://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_1080p_stereo.ogg
	 */
	@property()
	public accessor video: string;

	/**
	 * The provider to show above the embed, for example for YouTube videos it will show "YouTube" at the top of the embed (above the author)
	 *
	 * @example YouTube
	 */
	@property()
	public accessor provider: string;

	@consume({ context: messagesLightTheme, subscribe: true })
	@property({ type: Boolean, reflect: true, attribute: 'light-theme' })
	public accessor lightTheme = false;

	protected override render() {
		return html`<div class="discord-embed-root" style=${styleMap({ 'border-left-color': this.color })}>
			<div class="discord-embed-wrapper">
				<div class="discord-embed-grid">
					${when(this.provider, () => html`<div class="discord-embed-provider">${this.provider}</div>`)}
					${when(
						this.authorName,
						() =>
							html`<div class="discord-embed-author">
								${when(this.authorImage, () => html`<img src=${ifDefined(this.authorImage)} alt="" class="discord-author-image" />`)}
								${when(
									this.authorUrl,
									() =>
										html`<a
											href=${ifDefined(this.authorUrl)}
											target="_blank"
											rel="noopener noreferrer"
											class="discord-embed-author-block"
										>
											<span class="discord-embed-author-block">${this.authorName}</span>
										</a>`,
									() => html`<span class="discord-embed-author-block">${this.authorName}</span>`
								)}
							</div>`
					)}
					<slot name="title"></slot>
					<slot name="description"></slot>
					<slot name="fields"></slot>
					${when(
						this.image || this.video,
						() =>
							html`<div class=${classMap({ 'discord-embed-media': true, 'discord-embed-media-video': Boolean(this.video) })}>
								${this.renderMedia()}
							</div>`
					)}
					${when(this.thumbnail, () => html`<img src=${ifDefined(this.thumbnail)} alt="" class="discord-embed-thumbnail" />`)}
					<slot name="footer"></slot>
				</div>
			</div>
		</div>`;
	}

	private renderMedia() {
		if (this.video) {
			return html`
				<video
					controls
					muted
					preload="none"
					poster=${ifDefined(this.image)}
					src=${ifDefined(this.video)}
					height="225"
					width="400"
					class="discord-embed-video"
				>
					<img src=${ifDefined(this.image)} alt="Discord embed media" class="discord-embed-image" />
				</video>
			`;
		}

		if (this.image) {
			return html`<img src=${ifDefined(this.image)} alt="Discord embed media" class="discord-embed-image" />`;
		}

		return null;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-embed': DiscordEmbed;
	}
}
