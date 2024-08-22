export interface DiffbotResponse {
    request?: {
        pageUrl?: string;
        api?: string;
        version?: number;
    };
    humanLanguage?: string;
    objects?: {
        citation?: any;
        reviews?: any;
        relatedArticles?: any;
        video?: any;
        socialMedia?: any;
        embedUrl?: string;
        date?: string;
        images?: {
            diffbotUri?: string;
            title?: string;
            url?: string;
            primary?: boolean;
        }[];
        author?: string;
        mime?: string;
        naturalHeight?: number;
        diffbotUri?: string;
        type?: string;
        title?: string;
        naturalWidth?: number;
        url?: string;
        duration?: string;
        humanLanguage?: string;
        html?: string;
        pageUrl?: string;
        text?: string;
        viewCount?: number;
        types?: string[];
        siteName?: string;
        publisherRegion?: string;
        publisherCountry?: string;
        publisherState?: string;
        publisherCity?: string;
        publisherStreet?: string;
        publisherName?: string;
        nextPages?: string[];
        categories?: {
            score?: number;
            name?: string;
            id?: string;
        }[];
        emailAddresses?: {
            contactString?: string;
            type?: string;
        }[];
        twitterUri?: string;
        origin?: string;
        description?: string;
        nbActiveEmployeeEdges?: number;
        nbIncomingEdges?: number;
        importance?: number;
        allUris?: string[];
        allOriginHashes?: string[];
        crawlTimestamp?: number;
        nbOrigins?: number;
        name?: string;
        id?: string;
    }[];
    type?: string;
    title?: string;
}