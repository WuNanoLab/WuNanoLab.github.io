import { type ReactNode } from 'react'
import {
  FluentProvider,
  webLightTheme,
  Persona,
  Badge,
  Divider,
  Image,
  Link,
  makeStyles,
  tokens,
  type AvatarSize,
} from '@fluentui/react-components'
import {
  Carousel,
  CarouselCard,
  CarouselNav,
  CarouselNavContainer,
  CarouselNavImageButton,
  CarouselSlider,
  CarouselViewport,
} from '@fluentui/react-carousel'
import people from './people.json'
import photo from './photo.json'

const useStyles = makeStyles({
  app: {
    padding: '2rem 1.5rem',
    maxWidth: '960px',
    margin: '0 auto',
    display: 'grid',
    rowGap: '2.5rem',
  },
  section: {
    display: 'grid',
    rowGap: '1.5rem',
  },
  list: {
    display: 'grid',
    rowGap: '1rem',
  },
  photoCaption: {
    display: 'flex',
    columnGap: '0.5rem',
  },
})

const ASSETS_BASE = __DEV__ ? '/assets/' : '/assets/react/'

type EditorialLink = {
  label: string
  href: string
}

type EditorialPosition = {
  label: string
  links: EditorialLink[]
}

const affiliationColors = {
  TTU: 'danger',
  USF: 'success',
} as const

const usePersonaCardStyles = makeStyles({
  secondaryBlock: {
    display: 'grid',
    rowGap: '0.25rem',
    justifyItems: 'flex-start',
  },
  primaryText: {
    display: 'inline-flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    columnGap: '0.5rem',
  },
  metaLine: {
    color: tokens.colorNeutralForeground2,
    '& strong': {
      color: tokens.colorNeutralForeground1,
    },
    '& ul': {
      margin: '0.25rem 0 0 1.25rem',
    },
  },
  linkRow: {
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: '0.75rem',
    rowGap: '0.25rem',
    justifyContent: 'flex-start',
  },
})

const PersonaCard = ({
  person,
  faculty = false,
  size = 96,
  lines = [],
}: {
  person: Person,
  faculty?: boolean,
  size?: AvatarSize,
  lines?: Array<ReactNode | undefined>
}) => {
  const styles = usePersonaCardStyles()
  const email = person.email ?? person.contact?.email
  const phone = person.contact?.phone
  const affiliation = person.affiliation
  const linkItems = [
    email ? (
      <Link key="email" href={`mailto:${email}`}>
        {email}
      </Link>
    ) : null,
    phone ? (
      <Link key="phone" href={`tel:${phone.replace(/[^\d+]/g, '')}`}>
        {phone}
      </Link>
    ) : null,
    person.linkedin ? (
      <Link key="linkedin" href={person.linkedin} target="_blank" rel="noreferrer">
        LinkedIn
      </Link>
    ) : null,
    person.google_scholar ? (
      <Link key="google" href={person.google_scholar} target="_blank" rel="noreferrer">
        Google Scholar
      </Link>
    ) : null,
    person.research_gate ? (
      <Link key="researchgate" href={person.research_gate as string} target="_blank" rel="noreferrer">
        ResearchGate
      </Link>
    ) : null,
    person.cv ? (
      <Link key="cv" href={person.cv as string} target="_blank" rel="noreferrer">
        CV
      </Link>
    ) : null,
  ].filter(i => !!i)
  const infoLines = lines
    .map((line) => {
      if (line == null) {
        return undefined
      }
      if (typeof line === 'string') {
        const trimmed = line.trim()
        return trimmed.length > 0 ? trimmed : undefined
      }
      return line
    })
    .filter(line => !!line)
  const hasContent = infoLines.length > 0 || linkItems.length > 0

  return (
    <Persona
      name={person.name}
      size="huge"
      textPosition={faculty ? "below" : undefined}
      textAlignment={faculty ? "center" : undefined}
      avatar={person.avatar_filename ? {
        size,
        image: { src: `${ASSETS_BASE}people/${person.avatar_filename}` },
        color: 'colorful',
      } : undefined}
      primaryText={affiliation
        ? (
          <span className={styles.primaryText}>
            <span>{person.name}</span>
            <Badge appearance="tint" color={affiliationColors[affiliation as keyof typeof affiliationColors]}>
              {affiliation}
            </Badge>
          </span>
        )
        : undefined}
      secondaryText={
        hasContent
          ? <div className={styles.secondaryBlock}>
            {infoLines.map((line, index) => (
              <div key={index} className={styles.metaLine}>
                {line}
              </div>
            ))}
            {linkItems.length > 0 && <div className={styles.linkRow}>{linkItems}</div>}
          </div>
          : undefined
      }
    />
  )
}

const renderEditorialPosition = (position: EditorialPosition) => (
  <div style={{ paddingLeft: '1.5rem' }}>
    <strong>{position.label}:</strong>{' '}
    {position.links.map((link, index) => (
      <span key={link.label}>
        {index > 0 && ' | '}
        <Link href={link.href} target="_blank" rel="noreferrer">
          {link.label}
        </Link>
      </span>
    ))}
  </div>
)

const degreeColors = {
  'Ph.D.': 'severe',
  'M.S.': 'success',
  'B.S.': 'warning',
} as const
const renderEducationEntry = (edu: NonNullable<Person['education']>[number]) => (
  <div style={{ display: 'flex', alignItems: 'center', columnGap: '0.5rem' }}>
    <Badge appearance="outline" color={degreeColors[edu.degree as keyof typeof degreeColors] ?? 'subtle'}>
      {edu.degree}
    </Badge>
    <span>{`${edu.university} (${edu.duration})`}</span>
  </div>
)

const renderExperienceEntry = (experience: NonNullable<Person['experience']>[number]) => (
  <div>
    {experience.title}, {experience.institution}
    {experience.department ? `, ${experience.department}` : ''} ({experience.duration})
  </div>
)

const FacultySection = () => {
  const styles = useStyles()
  return (
    <section className={styles.section}>
      <h1>Faculty</h1>
      <div className={styles.list}>
        {people.faculty.map((person) => (
          <PersonaCard
            key={person.name}
            person={person}
            faculty
            size={128}
            lines={[
              <b>{person.title}</b>,
              <b>{person.department}</b>,
              <b>Education:</b>,
              <ul>
                {person.education?.map((edu) => (
                  <li key={edu.duration}>{renderEducationEntry(edu)}</li>
                ))}
              </ul>,
              (person as Person).experience?.length
                ? (
                  <>
                    <strong>Recent Professional Experience:</strong>
                    <ul>
                      {(person as Person).experience!.map((experience) => (
                        <li key={`${experience.duration}-${experience.institution}`}>
                          {renderExperienceEntry(experience)}
                        </li>
                      ))}
                    </ul>
                  </>
                )
                : undefined,
              (person.editorial_positions as EditorialPosition[] | undefined)?.length
                ? (
                  <>
                    <strong>Editorial Positions:</strong>
                    {(person.editorial_positions as EditorialPosition[]).map((position) => (
                      renderEditorialPosition(position)
                    ))}
                  </>
                )
                : undefined,
              person.awards_and_honors?.length
                ? (
                  <>
                    <strong>Awards &amp; Honors:</strong>
                    <ul>
                      {person.awards_and_honors.map((award: { year: string; text: string }) => (
                        <li key={`${award.year}-${award.text}`}>
                          <Badge appearance="tint" style={{ marginRight: '0.5rem' }}>{award.year}</Badge>
                          <span>{award.text}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )
                : undefined,
            ]}
          />
        ))}
      </div>
    </section>
  )
}

const StudentsSection = () => {
  const styles = useStyles()
  const subsections: Array<[string, Person[]]> = [
    ['Postdoctoral Researchers', people.current_students.postdocs],
    ['Ph.D. Students', people.current_students.phd_students],
    ['Ph.D. Students (Remote)', people.current_students.phd_students_remote],
    ['M.S. Students', people.current_students.ms_students],
    ['Undergraduate Students', people.current_students.undergraduate_students],
    ['High School Students', people.current_students.high_school_students],
  ]

  return (
    <section className={styles.section}>
      <h1>Current Students</h1>
      {subsections.map(([label, entries]) => (
        <div key={label} className={styles.section}>
          <h2>{label}</h2>
          <div className={styles.list}>
            {entries.map((person) => (
              <PersonaCard
                key={person.name}
                person={person}
                lines={[
                  person.study ?? person.research_topics ?? person.school,
                  person.education?.length
                    ? (
                      <>
                        <strong>Education:</strong>
                        <ul>
                          {person.education.map((edu) => (
                            <li key={edu.duration}>{renderEducationEntry(edu)}</li>
                          ))}
                        </ul>
                      </>
                    )
                    : undefined,
                  (person as Person).experience?.length
                    ? (
                      <>
                        <strong>Recent Professional Experience:</strong>
                        <ul>
                          {(person as Person).experience!.map((experience) => (
                            <li key={`${experience.duration}-${experience.institution}`}>
                              {renderExperienceEntry(experience)}
                            </li>
                          ))}
                        </ul>
                      </>
                    )
                    : undefined,
                  person.awards?.length
                    ? (
                      <>
                        <strong>Awards:</strong>
                        <ul>
                          {person.awards.map((award) => (
                            <li key={award}>{award}</li>
                          ))}
                        </ul>
                      </>
                    )
                    : undefined,
                ]}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

const IndustrySection = () => {
  const styles = useStyles()
  const entries: Person[] = people.industry_collaborators || []

  return (
    <section className={styles.section}>
      <h1>Industry Collaborators</h1>
      <div className={styles.list}>
        {entries.map((person) => (
          <PersonaCard
            key={person.name}
            person={person}
            lines={[person.company, person.location]}
          />
        ))}
      </div>
    </section>
  )
}

const AlumniSection = () => {
  const styles = useStyles()
  const subsections: Array<[string, Person[]]> = [
    ['M.S. Alumni', people.alumni.ms_students],
    ['Undergraduate Alumni', people.alumni.undergraduate_students],
    ['High School Alumni', people.alumni.high_school_students],
  ]

  return (
    <section className={styles.section}>
      <h1>Alumni</h1>
      {subsections.map(([label, entries]) => (
        <div key={label} className={styles.section}>
          <h2>{label}</h2>
          <div className={styles.list}>
            {entries.map((person) => (
              <PersonaCard
                key={`${person.name}-${person.duration ?? 'alumni'}`}
                person={person}
                lines={[person.department ?? person.school, person.duration]}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

const PhotoSection = () => {
  const styles = useStyles()
  return (
    <section className={styles.section}>
      <h1>Photos</h1>
      <Carousel>
        <CarouselViewport>
          <CarouselSlider>
            {photo.map((img, index) => (
              <CarouselCard key={index}>
                {(img.title || img.date) && (
                  <div className={styles.photoCaption}>
                    {img.date && <Badge appearance="tint">{img.date}</Badge>}
                    {img.title && <>{img.title}</>}
                  </div>
                )}
                <p></p>
                <Image
                  src={`${ASSETS_BASE}photo/${img.filename}`}
                  alt={img.title ?? `Photo ${index + 1}`}
                  width={600}
                  height={400}
                  fit="contain"
                />
              </CarouselCard>
            ))}
          </CarouselSlider>
        </CarouselViewport>
        <CarouselNavContainer>
          <CarouselNav>
            {index => (
              <CarouselNavImageButton
                key={index}
                image={{ src: `${ASSETS_BASE}photo/${photo[index].filename}` }}
              />
            )}
          </CarouselNav>
        </CarouselNavContainer>
      </Carousel>
    </section>
  )
}

export const App = () => {
  const styles = useStyles()
  return (
    <FluentProvider theme={webLightTheme}>
      <main className={styles.app}>
        <FacultySection />
        <Divider />
        <StudentsSection />
        <Divider />
        <IndustrySection />
        <Divider />
        <AlumniSection />
        <Divider />
        <PhotoSection />
      </main>
    </FluentProvider>
  )
}
