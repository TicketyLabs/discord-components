import { consume } from '@lit/context';
import { css, html, LitElement, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';
import type { LightTheme } from '../../types.js';
import { isItemSpoiler as checkItemSpoiler, SpoilerMixin } from '../../util/spoiler.js';
import { messagesLightTheme } from '../discord-messages/DiscordMessages.js';

interface MediaItem {
	alt?: string;
	spoiler?: boolean;
	url: string;
}

/**
 * A media gallery component for displaying multiple images or media within Discord embed v2 containers.
 * Automatically arranges media in a grid layout based on the number of items, matching Discord's gallery behavior.
 * Shows up to 10 items with a "+X more" overlay if there are additional items.
 */
@customElement('discord-media-gallery')
export class DiscordMediaGallery extends SpoilerMixin(LitElement) implements LightTheme {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		:host {
			display: block;
			margin-top: 16px;
			width: 100%;
			max-width: 100%;
		}

		.discord-media-gallery-container {
			display: grid;
			gap: 4px;
			border-radius: 8px;
			overflow: hidden;
			width: 100%;
		}

		.discord-media-gallery-item {
			position: relative;
			overflow: hidden;
			border-radius: 4px;
			width: 100%;
			height: 100%;
		}

		.discord-media-gallery-item img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			display: block;
		}

		.discord-media-gallery-item[data-spoiler]:not([data-spoiler-revealed]) img {
			filter: blur(44px);
		}

		.discord-media-gallery-overlay {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: rgba(0, 0, 0, 0.7);
			color: white;
			font-size: 20px;
			font-weight: bold;
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

		::slotted(*) {
			display: none;
		}
	`;

	/**
	 * Array of media items to display in the gallery.
	 * Each item should have a 'url' property and optionally an 'alt' and 'spoiler' property.
	 */
	@property({ type: Array })
	public accessor items: MediaItem[] = [];

	@state()
	private accessor slottedItems: Element[] = [];

	@state()
	private accessor revealedItems: Set<number> = new Set();

	@consume({ context: messagesLightTheme, subscribe: true })
	@property({ type: Boolean, reflect: true, attribute: 'light-theme' })
	public accessor lightTheme = false;

	protected override firstUpdated(): void {
		this.updateSlottedItems();
	}

	protected override updated(changedProperties: PropertyValues): void {
		if (changedProperties.has('items')) {
			this.requestUpdate();
		}
	}

	private updateSlottedItems(): void {
		const slot = this.shadowRoot?.querySelector('slot');
		if (slot) {
			const elements = slot.assignedElements();
			this.slottedItems = elements;
		}
	}

	private getGalleryLayout(count: number): Record<string, string> {
		// 1 item: single full-width
		if (count === 1) {
			return {
				'grid-template-columns': '1fr',
				'grid-template-rows': 'auto'
			};
		}

		// 2 items: two columns
		if (count === 2) {
			return {
				'grid-template-columns': '1fr 1fr',
				'grid-template-rows': 'auto'
			};
		}

		// 3 items: one large left, two small stacked right
		if (count === 3) {
			return {
				'grid-template-columns': '2fr 1fr',
				'grid-template-rows': '1fr 1fr'
			};
		}

		// 4 items: 2x2 grid
		if (count === 4) {
			return {
				'grid-template-columns': '1fr 1fr',
				'grid-template-rows': '1fr 1fr'
			};
		}

		// 5 items: 2 large top, 3 small bottom
		if (count === 5) {
			return {
				'grid-template-columns': 'repeat(6, 1fr)',
				'grid-template-rows': 'auto auto'
			};
		}

		// 6 items: 3 columns, 2 rows
		if (count === 6) {
			return {
				'grid-template-columns': '1fr 1fr 1fr',
				'grid-template-rows': '1fr 1fr'
			};
		}

		// 7+ items: 1 large top, 3x2 grid below (showing up to 10)
		if (count === 7) {
			return {
				'grid-template-columns': 'repeat(3, 1fr)',
				'grid-template-rows': 'auto auto auto'
			};
		}

		// 8-9 items
		if (count === 8 || count === 9) {
			return {
				'grid-template-columns': 'repeat(3, 1fr)',
				'grid-template-rows': 'auto auto auto'
			};
		}

		// 10 items: 1 large top, 3x3 grid below
		return {
			'grid-template-columns': 'repeat(3, 1fr)',
			'grid-template-rows': 'auto auto auto auto'
		};
	}

	private getImageStyle(index: number, count: number): Record<string, string> {
		// 1 item: full width, 16:9 aspect ratio
		if (count === 1) {
			return {
				'aspect-ratio': '16/9'
			};
		}

		// 2 items: equal size, square
		if (count === 2) {
			return {
				'aspect-ratio': '1'
			};
		}

		// 3 items: first is large (spans 2 rows), others are small
		if (count === 3) {
			if (index === 0) {
				return {
					'grid-row': 'span 2',
					'aspect-ratio': '1'
				};
			}

			return {
				'aspect-ratio': '1'
			};
		}

		// 4 items: all equal squares
		if (count === 4) {
			return {
				'aspect-ratio': '1'
			};
		}

		// 5 items: first 2 are large, last 3 are small
		if (count === 5) {
			if (index < 2) {
				return {
					'grid-column': 'span 3',
					'aspect-ratio': '16/9'
				};
			}

			return {
				'grid-column': 'span 2',
				'aspect-ratio': '1'
			};
		}

		// 6 items: all equal in 3x2 grid
		if (count === 6) {
			return {
				'aspect-ratio': '1'
			};
		}

		// 7+ items: first is large, rest are small
		if (count >= 7) {
			if (index === 0) {
				return {
					'grid-column': 'span 3',
					'aspect-ratio': '16/9'
				};
			}

			return {
				'aspect-ratio': '1'
			};
		}

		return {
			'aspect-ratio': '1'
		};
	}

	protected override render() {
		const displayItems = this.items.length > 0 ? this.items : this.getItemsFromSlot();
		const itemCount = displayItems.length;

		if (itemCount === 0) {
			return html`<slot @slotchange=${this.updateSlottedItems}></slot>`;
		}

		const itemsToShow = displayItems.slice(0, 10);
		const hasMore = itemCount > 10;
		const remainingCount = itemCount - 10;

		return html`
			<div class="discord-media-gallery-container" style=${styleMap(this.getGalleryLayout(itemCount))}>
				${repeat(
					itemsToShow,
					(_item, index) => index,
					(item, index) => {
						const isSpoiler = checkItemSpoiler(this.spoiler, item.spoiler);
						const isRevealed = this.isItemRevealed(index);
						return html`
							<div
								class="discord-media-gallery-item"
								style=${styleMap(this.getImageStyle(index, itemCount))}
								?data-spoiler=${isSpoiler}
								?data-spoiler-revealed=${isRevealed}
							>
								<img src=${item.url} alt=${item.alt ?? 'Media content'} />
								${when(
									isSpoiler && !isRevealed,
									() => html`
										<div class="spoiler-overlay" @click=${() => this.revealItem(index)} @keydown=${() => this.revealItem(index)}>
											<span class="spoiler-warning">Spoiler</span>
										</div>
									`
								)}
								${when(
									hasMore && index === itemsToShow.length - 1,
									() => html` <div class="discord-media-gallery-overlay">+${remainingCount}</div> `
								)}
							</div>
						`;
					}
				)}
			</div>
			<slot @slotchange=${this.updateSlottedItems} style="display: none;"></slot>
		`;
	}

	private getItemsFromSlot(): MediaItem[] {
		if (this.slottedItems.length === 0) return [];

		return this.slottedItems
			.filter((el) => el.tagName === 'IMG')
			.map((img) => ({
				url: img.getAttribute('src') ?? '',
				alt: img.getAttribute('alt') ?? undefined
			}));
	}

	private revealItem(index: number) {
		this.revealedItems = new Set([...this.revealedItems, index]);
	}

	private isItemRevealed(index: number): boolean {
		return this.revealedItems.has(index);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-media-gallery': DiscordMediaGallery;
	}
}
