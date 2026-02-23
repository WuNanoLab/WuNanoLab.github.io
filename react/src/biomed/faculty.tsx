import {
  makeStyles,
  tokens,
  Card,
  CardHeader,
  Text,
  Badge,
  Avatar,
  Divider,
} from "@fluentui/react-components";
import facultyData from './faculty.json'

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXXL,
    padding: tokens.spacingHorizontalL,
  },
  sectionTitle: {
    marginBottom: tokens.spacingVerticalM,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: tokens.spacingHorizontalL,
  },
  card: {
    width: "100%",
    maxWidth: "100%",
    height: "100%",
  },
  researchLabel: {
    fontWeight: "bold",
    marginTop: tokens.spacingVerticalS,
  },
  researchText: {
    color: tokens.colorNeutralForeground2,
    marginTop: tokens.spacingVerticalXS,
    lineHeight: "1.5",
  },
  formerList: {
    display: "flex",
    flexWrap: "wrap",
    gap: tokens.spacingHorizontalM,
  },
});

export const FacultySection = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <section>
        <Text as="h2" size={600} weight="semibold" className={styles.sectionTitle}>
          Current Faculty Members
        </Text>
        <div className={styles.grid}>
          {facultyData.currentFaculty.map((faculty, index) => (
            <Card key={index} className={styles.card} appearance="outline">
              <CardHeader
                image={<Avatar name={faculty.name} color="colorful" />}
                header={
                  <Text weight="semibold" size={400}>
                    {faculty.name}
                  </Text>
                }
                action={<Badge appearance="tint">{faculty.department}</Badge>}
              />
              <div>
                <Text size={200} className={styles.researchLabel} block>
                  Research Areas:
                </Text>
                <Text size={200} className={styles.researchText} block>
                  {faculty.researchAreas}
                </Text>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Divider />

      <section>
        <Text as="h2" size={500} weight="semibold" className={styles.sectionTitle}>
          Former Faculty Members
        </Text>
        <div className={styles.formerList}>
          {facultyData.formerFaculty.map((name, index) => (
            <Badge key={index} appearance="outline" size="large">
              {name}
            </Badge>
          ))}
        </div>
      </section>
    </div>
  );
};
