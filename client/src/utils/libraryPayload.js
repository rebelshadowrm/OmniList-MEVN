import { mediaConfig } from '../config/mediaTypes.js'

export function mediaExternalId(item = {}) {
  return `${item?.entityRef?.externalId ?? item?.externalId ?? item?.sourceId ?? item?.mediaId ?? item?.animeId ?? item?.id ?? ''}`
}

export function libraryEntryKey(item = {}, mediaType = item?.mediaType) {
  if (item?.entityRef?.key) {
    return item.entityRef.key
  }

  const media = mediaConfig(mediaType ?? item?.mediaType)
  const externalId = mediaExternalId(item)

  return externalId ? `${media.source}:${media.type}:${externalId}` : null
}

export function mediaTitle(item = {}) {
  return item?.title?.english ?? item?.title?.romaji ?? item?.title?.native ?? item?.title ?? 'Untitled'
}

export function buildLibraryEntryPayload({ userId, mediaType, catalogItem = {} }) {
  const media = mediaConfig(mediaType ?? catalogItem?.mediaType)
  const externalId = mediaExternalId(catalogItem)
  const progressTotal = catalogItem?.progressTotal ?? catalogItem?.[media.totalField] ?? 0

  return {
    user: userId,
    mediaId: catalogItem?.id,
    externalId,
    entityRef: catalogItem?.entityRef,
    mediaType: media.type,
    source: media.source,
    sourceId: externalId,
    animeId: media.type === 'ANIME' ? catalogItem?.id : undefined,
    title: mediaTitle(catalogItem),
    status: media.activeStatus,
    progress: 0,
    totalEpisodes: progressTotal,
    progressTotal,
    progressUnit: media.progressUnit,
    rating: 0,
    image: catalogItem?.coverImage?.large ?? catalogItem?.image ?? '',
    format: catalogItem?.format,
    genres: catalogItem?.genres,
  }
}
