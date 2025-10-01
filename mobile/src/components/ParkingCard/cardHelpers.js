// src/components/ParkingCard/cardHelpers.js

import { debugLogger as logger } from '../../utils/loggers';

// json parsing helpers
export const parseZoneInfo = (spot) => {
    const original = spot?.zone_info;
    let parsed = {};
    if (typeof original === 'string') {
        try {
            parsed = JSON.parse(original);
            logger.log(
                'parsed zone_info from string',
                {
                    original_preview: original.slice(0, 100),
                    keys: Object.keys(parsed || {}),
                },
                'data_parse'
            );
        } catch (e) {
            logger.log(
                'failed to parse zone_info',
                { error: e?.message, original_preview: original.slice(0, 100) },
                'error'
            );
            parsed = {};
        }
    } else {
        parsed = original || {};
    }
    return parsed;
};

export const parseMetadata = (spot) => {
    const original = spot?.metadata;
    let parsed = {};
    if (typeof original === 'string') {
        try {
            parsed = JSON.parse(original);
            logger.log(
                'parsed metadata from string',
                {
                    original_preview: original.slice(0, 100),
                    keys: Object.keys(parsed || {}),
                },
                'data_parse'
            );
        } catch (e) {
            logger.log(
                'failed to parse metadata',
                { error: e?.message, original_preview: original.slice(0, 100) },
                'error'
            );
            parsed = {};
        }
    } else {
        parsed = original || {};
    }
    return parsed;
};

// value helpers
export const getCurrentPrice = (spot, zoneInfo) => {
    if (spot?.price_zone) return `Zone ${spot.price_zone}`;
    if (zoneInfo?.price_zone) return `Zone ${zoneInfo.price_zone}`;
    const html = spot?.html_zone_rate || zoneInfo?.html_zone_rate;
    if (typeof html === 'string' && html.includes('$')) {
        const match = html.match(/\$\s*\d+(?:\.\d{1,2})?/);
        if (match) return `${match[0].replace(/\s+/g, '')}/hr`;
    }
    return 'Check signs';
};

export const getSpotType = (spot) =>
    spot?.spot_type?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Street Parking';

export const parseHtmlZoneRate = (html) => {
    if (!html) return [];
    const decoded = String(html)
        .replace(/\\u003C/g, '<')
        .replace(/\\u003E/g, '>')
        .replace(/<br\s*\/?>/g, '\n')
        .replace(/<\/?b>/g, '');
    const lines = decoded.split('\n').filter((l) => l.trim());
    const out = [];
    let cur = null;
    for (const line of lines) {
        const t = line.trim();
        if (t.includes(':') && !t.includes('$') && !t.toLowerCase().includes('free')) {
            if (cur) out.push(cur);
            cur = { period: t, rate: '' };
        } else if (t.includes('$') || t.toLowerCase().includes('free')) {
            if (cur) {
                cur.rate = t;
                out.push(cur);
                cur = null;
            } else {
                out.push({ period: '', rate: t });
            }
        }
    }
    if (cur?.rate) out.push(cur);
    return out;
};

export const getPricingData = (spot, zoneInfo) => {
    const html = spot?.html_zone_rate || zoneInfo?.html_zone_rate;
    return parseHtmlZoneRate(html);
};

// build pages for ui
export const getDetailsPages = (spot) => {
    const zoneInfo = parseZoneInfo(spot || {});
    const metadata = parseMetadata(spot || {});
    const pages = [];

    logger.log(
        'details compile start',
        {
            spot_id: spot?.id ?? null,
            field_count: Object.keys(spot || {}).length,
            has_zone_info: !!zoneInfo && Object.keys(zoneInfo).length > 0,
            has_metadata: !!metadata && Object.keys(metadata).length > 0,
        },
        'data_compilation'
    );

    // 1) details & restrictions
    const basicInfo = [];
    if (spot?.status) basicInfo.push({ label: 'Status', value: spot.status });
    if (spot?.zone_type) basicInfo.push({ label: 'Zone Type', value: spot.zone_type });
    if (spot?.permit_zone) basicInfo.push({ label: 'Permit Zone', value: spot.permit_zone });
    if (spot?.max_time) basicInfo.push({ label: 'Max Time', value: spot.max_time });
    if (spot?.block_side) basicInfo.push({ label: 'Block Side', value: spot.block_side });
    if (spot?.enforceable_time) basicInfo.push({ label: 'Enforceable Time', value: spot.enforceable_time });
    if (spot?.parking_restrict_type)
        basicInfo.push({ label: 'Restriction Type', value: spot.parking_restrict_type });
    if (spot?.parking_restrict_time)
        basicInfo.push({ label: 'Restriction Time', value: spot.parking_restrict_time });
    if (spot?.parking_restriction)
        basicInfo.push({ label: 'Parking Restriction', value: spot.parking_restriction });
    if (spot?.time_restriction) basicInfo.push({ label: 'Time Restriction', value: spot.time_restriction });
    if (spot?.no_stopping) basicInfo.push({ label: 'No Stopping', value: spot.no_stopping });

    if (zoneInfo?.zone_type) basicInfo.push({ label: 'Zone Type', value: zoneInfo.zone_type });
    if (zoneInfo?.permit_zone) basicInfo.push({ label: 'Permit Zone', value: zoneInfo.permit_zone });
    if (zoneInfo?.enforceable_time) basicInfo.push({ label: 'Enforceable Time', value: zoneInfo.enforceable_time });

    if (metadata?.max_time) basicInfo.push({ label: 'Max Time', value: metadata.max_time });
    if (metadata?.stall_type) basicInfo.push({ label: 'Stall Type', value: metadata.stall_type });
    if (metadata?.lot_name) basicInfo.push({ label: 'Lot Name', value: metadata.lot_name });
    if (metadata?.block_side) basicInfo.push({ label: 'Block Side', value: metadata.block_side });
    if (metadata?.parking_restriction) basicInfo.push({ label: 'Restriction', value: metadata.parking_restriction });
    if (metadata?.time_restriction) basicInfo.push({ label: 'Time Restriction', value: metadata.time_restriction });

    const uniqueBasicInfo = Array.from(
        new Map(basicInfo.map((item) => [`${item.label}:${item.value}`, item])).values()
    );
    if (uniqueBasicInfo.length > 0) {
        pages.push({ title: 'Details & Restrictions', items: uniqueBasicInfo });
    }

    // 2) pricing & zones
    const pricingInfo = [];
    const pricing = getPricingData(spot || {}, zoneInfo || {});
    if (pricing.length > 0) {
        pricing.forEach((p) => {
            pricingInfo.push({ label: p.period || 'Rate', value: p.rate, highlight: true });
        });
    }
    if (spot?.price_zone)
        pricingInfo.push({ label: 'Price Zone', value: `Zone ${spot.price_zone}`, highlight: true });
    if (zoneInfo?.price_zone)
        pricingInfo.push({ label: 'Price Zone', value: `Zone ${zoneInfo.price_zone}`, highlight: true });
    if (spot?.parking_zone)
        pricingInfo.push({ label: 'Parking Zone', value: spot.parking_zone, highlight: true });

    const uniquePricingInfo = Array.from(
        new Map(pricingInfo.map((item) => [`${item.label}:${item.value}`, item])).values()
    );
    if (uniquePricingInfo.length > 0) {
        pages.push({ title: 'Pricing & Zones', items: uniquePricingInfo });
    }

    // 3) capacity & technical
    const capacityInfo = [];
    if (spot?.capacity) capacityInfo.push({ label: 'Capacity', value: `${spot.capacity} spaces` });
    if (spot?.zone_cap) capacityInfo.push({ label: 'Zone Capacity', value: `${spot.zone_cap} spaces` });
    if (spot?.seg_cap) capacityInfo.push({ label: 'Segment Capacity', value: `${spot.seg_cap} spaces` });
    if (spot?.zone_length) capacityInfo.push({ label: 'Zone Length', value: `${spot.zone_length}m` });
    if (spot?.seg_length) capacityInfo.push({ label: 'Segment Length', value: `${spot.seg_length}m` });
    if (spot?.stall_type) capacityInfo.push({ label: 'Stall Type', value: spot.stall_type });
    if (spot?.parking_type) capacityInfo.push({ label: 'Parking Type', value: spot.parking_type });
    if (spot?.ctp_class) capacityInfo.push({ label: 'CTP Class', value: spot.ctp_class });
    if (spot?.dot) capacityInfo.push({ label: 'DOT', value: spot.dot });
    if (spot?.octant) capacityInfo.push({ label: 'Octant', value: spot.octant });

    if (capacityInfo.length > 0) {
        pages.push({ title: 'Capacity & Technical', items: capacityInfo });
    }

    // 4) additional information
    const additionalInfo = [];
    if (spot?.lot_name) additionalInfo.push({ label: 'Lot Name', value: spot.lot_name });
    if (spot?.lot_num) additionalInfo.push({ label: 'Lot Number', value: spot.lot_num });
    if (spot?.description) additionalInfo.push({ label: 'Description', value: spot.description });
    if (spot?.global_id || spot?.globalid_guid)
        additionalInfo.push({ label: 'ID', value: spot.global_id || spot.globalid_guid });
    if (spot?.camera !== undefined) additionalInfo.push({ label: 'Camera', value: spot.camera ? 'Yes' : 'No' });
    if (metadata?.camera !== undefined)
        additionalInfo.push({ label: 'Camera', value: metadata.camera ? 'Yes' : 'No' });
    if (spot?.home_page) additionalInfo.push({ label: 'More Info', value: 'Website Available', link: spot.home_page });
    if (spot?.address || spot?.address_desc)
        additionalInfo.push({ label: 'Address', value: spot.address || spot.address_desc });

    const uniqueAdditionalInfo = Array.from(
        new Map(additionalInfo.map((item) => [item.label, item])).values()
    );
    if (uniqueAdditionalInfo.length > 0) {
        pages.push({ title: 'Additional Information', items: uniqueAdditionalInfo });
    }

    logger.log(
        'details compile done',
        {
            page_count: pages.length,
            titles: pages.map((p) => p.title),
            total_items: pages.reduce((sum, p) => sum + p.items.length, 0),
        },
        'data_compilation'
    );

    return pages.length > 0 ? pages : [{ title: 'No additional details available', items: [] }];
};
