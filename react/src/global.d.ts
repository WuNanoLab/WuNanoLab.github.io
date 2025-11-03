interface Person {
    name: string
    title?: string
    department?: string
    study?: string
    research_topics?: string
    email?: string
    awards?: string[]
    education?: string[]
    editorial_positions?: string[]
    corporate_advisor?: string
    contact?: {
        email?: string
        office?: string
        phone?: string
    }
    linkedin?: string
    google_scholar?: string
    school?: string
    duration?: string
    avatar_filename?: string
}

declare const __DEV__: boolean
