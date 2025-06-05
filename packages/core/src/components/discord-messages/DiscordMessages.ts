import { createContext, provide } from '@lit/context';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { defaultBackground, defaultMode, defaultTheme } from '../../config.js';
import type { LightTheme } from '../../types.js';
import ChannelForum from '../svgs/ChannelForum.js';
import ChannelIcon from '../svgs/ChannelIcon.js';
import ChannelThread from '../svgs/ChannelThread.js';
import LockedVoiceChannel from '../svgs/LockedVoiceChannel.js';
import VoiceChannel from '../svgs/VoiceChannel.js';

export const messagesLightTheme = createContext<boolean>('light-theme');
export const messagesCompactMode = createContext<boolean>('compact-mode');
export const messagesNoBackground = createContext<boolean>('no-background');

@customElement('discord-messages')
export class DiscordMessages extends LitElement implements LightTheme {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		:host {
			color: #fff;
			background-color: oklab(0.219499 0.00211129 -0.00744916);
			display: block;
			font-size: 16px;
			font-family: 'gg sans', 'Noto Sans', Whitney, 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;
			line-height: 170%;
			border: 1px solid rgba(255, 255, 255, 0.05);
		}

		:host([light-theme]) {
			color: #747f8d;
			background-color: oklab(0.988044 0.0000450313 0.0000197887);
			border-color: #dedede;
		}

		:host([no-background]) {
			background-color: unset;
		}

		::slotted(*) {
			padding-top: 0.125rem;
			padding-bottom: 0.125rem;
		}

		::slotted(*:first-child) {
			margin-top: 0.5rem;
		}

		::slotted(*:not(:first-child)) {
			margin-top: 1.0625rem;
		}

		:host([compact-mode]) ::slotted(*:not(:first-child)) {
			margin-top: unset;
		}

		::slotted(*:last-child) {
			margin-bottom: 0.5rem;
			border-bottom-width: 0;
		}

		:host .discord-channel-header {
			display: flex;
			align-items: center;
			padding: 0.5rem 1rem;
			box-shadow:
				0 2px 0 0 rgba(0, 0, 0, 0.05),
				0 1.5px 0 0 rgba(0, 0, 0, 0.05),
				0 1px 0 0 rgba(0, 0, 0, 0.16);
		}

		:host .discord-channel-icon {
			height: 24px;
			width: auto;
			margin: 0 8px;
			position: relative;
			flex: 0 0 auto;
			color: #80848e;
		}

		:host([light-theme]) .discord-channel-icon {
			color: #6d6f78;
		}

		:host .discord-channel-name {
			margin: 0 8px 0 0;
			flex: 0 0 auto;
			min-width: auto;
		}
	`;

	/**
	 * Whether to use light theme or not.
	 */
	@provide({ context: messagesLightTheme })
	@property({ type: Boolean, reflect: true, attribute: 'light-theme' })
	public accessor lightTheme = false;

	/**
	 * Whether to exclude the background or not.
	 */
	@provide({ context: messagesNoBackground })
	@property({ type: Boolean, reflect: true, attribute: 'no-background' })
	public accessor noBackground = false;

	/**
	 * Whether to use compact mode or not.
	 */
	@provide({ context: messagesCompactMode })
	@property({ type: Boolean, reflect: true, attribute: 'compact-mode' })
	public accessor compactMode = false;

	/**
	 * The type of channel this should be, this will be displayed above the message and only applies if {@link DiscordMessages.channelName} is set.
	 * Valid values are: `text`, `forum`, `locked`, `thread`, and `voice`.
	 */
	@property({ reflect: true, attribute: 'channel-type' })
	public accessor channelType: 'forum' | 'locked' | 'text' | 'thread' | 'voice';

	/**
	 * The name of the channel, this will be displayed above the message and only applies if {@link DiscordMessages.channelType} is set.
	 */

	@property({ reflect: true, attribute: 'channel-name' })
	public accessor channelName: string;

	public override connectedCallback(): void {
		super.connectedCallback();

		if (this.lightTheme || (defaultTheme === 'light' && this.lightTheme)) {
			this.lightTheme = true;
		}

		if (this.compactMode || (defaultMode === 'compact' && this.compactMode)) {
			this.compactMode = true;
		}

		if (this.noBackground || (defaultBackground === 'none' && this.noBackground)) {
			this.noBackground = true;
		}
	}

	protected override render() {
		let channelIcon: ReturnType<typeof html>;
		switch (this.channelType) {
			case 'text':
				channelIcon = html`${ChannelIcon()}`;
				break;
			case 'voice':
				channelIcon = html`${VoiceChannel()}`;
				break;
			case 'locked':
				channelIcon = html`${LockedVoiceChannel()}`;
				break;
			case 'thread':
				channelIcon = html`${ChannelThread()}`;
				break;
			case 'forum':
				channelIcon = html`${ChannelForum()}`;
				break;
		}

		return html`
			${when(
				this.channelType && this.channelName,
				() =>
					html`<div class="discord-channel-header">
						<div class="discord-channel-icon">${channelIcon}</div>
						<div class="discord-channel-name">${this.channelName}</div>
					</div>`
			)}
			<slot></slot>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-messages': DiscordMessages;
	}
}
