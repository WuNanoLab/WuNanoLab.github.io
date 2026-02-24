import {
  makeStyles,
  tokens,
  Text,
  Card,
  CardPreview,
  Divider,
} from "@fluentui/react-components";

type EquipmentItem = {
  name: string;
  image: string;
};

type EquipmentSection = {
  title: string;
  items: EquipmentItem[];
};

type EquipmentGalleryData = {
  sections: EquipmentSection[];
};

type EquipmentGalleryProps = {
  data: EquipmentGalleryData;
};

const ASSETS_BASE = __DEV__ ? '/assets/' : '/assets/react/'

const useStyles = makeStyles({
  container: {
    padding: tokens.spacingHorizontalXL
  },
  section: {
    marginBottom: tokens.spacingVerticalXXL,
  },
  title: {
    marginBottom: tokens.spacingVerticalL,
    display: "block",
  },
  // 核心网格布局
  galleryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: tokens.spacingHorizontalL,
  },
  card: {
    cursor: "pointer",
    ":hover": {
      boxShadow: tokens.shadow8, // 增加悬停时的阴影深度
    },
  },
  image: {
    aspectRatio: "4 / 3", // 统一图片比例，让网格对齐
    objectFit: "cover",
    width: "100%",
  },
  footer: {
    textAlign: "center",
    padding: tokens.spacingVerticalS,
  },
});

export const EquipmentGallery = ({ data }: EquipmentGalleryProps) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      {data.sections.map((section, sIdx) => (
        <div key={sIdx} className={styles.section}>
          <Text size={600} weight="semibold" className={styles.title}>
            {section.title}
          </Text>
          
          <div className={styles.galleryGrid}>
            {section.items.map((item, iIdx) => (
              <Card key={iIdx} className={styles.card} appearance="filled-alternative">
                <CardPreview>
                  <img
                    src={`${ASSETS_BASE}equipment/${item.image}`}
                    alt={item.name}
                    className={styles.image}
                  />
                </CardPreview>
                <div className={styles.footer}>
                  <Text weight="medium">{item.name}</Text>
                </div>
              </Card>
            ))}
          </div>
          {sIdx !== data.sections.length - 1 && <Divider style={{ marginTop: '40px' }} />}
        </div>
      ))}
    </div>
  );
};