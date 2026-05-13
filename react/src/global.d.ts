interface Person extends Record<string, unknown> {
    name: string
    title?: string
    department?: string
    study?: string
    research_topics?: string
    email?: string
    awards?: string[]
    education?: string[]
    editorial_positions?: Array<{
        label: string
        links: Array<{
            label: string
            href: string
        }>
    }>
    contact?: {
        email?: string
        office?: string
        phone?: string
    }
    linkedin?: string
    google_scholar?: string
    school?: string
    duration?: string
    company?: string
    location?: string
    avatar_filename?: string
}

declare const __DEV__: boolean
