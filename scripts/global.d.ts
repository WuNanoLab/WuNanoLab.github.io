interface WixPost {
    title: string;
    firstPublishedDate: string; // ISO
    lastPublishedDate: string;  // ISO
    url: {
        base: string;
        path: string;
    };
    slug: string;
    media: {
        wixMedia: {
            image: {
                id: string;
                url: string;
                height: number;
                width: number;
            };
        };
    };
    link: string;
}
