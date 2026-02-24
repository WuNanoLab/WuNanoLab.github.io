import {
    Carousel,
    CarouselCard,
    CarouselNav,
    CarouselNavContainer,
    CarouselNavImageButton,
    CarouselSlider,
    CarouselViewport,
    Image,
    makeStyles,
} from "@fluentui/react-components";

const ASSETS_BASE = __DEV__ ? '/assets/' : '/assets/react/'

const photo: Array<{ filename: string; title?: string }> = [
    { filename: 'IMG_7247.jpeg', title: 'Bench 2' },   
    { filename: 'IMG_7250.jpeg', title: 'Bench 2' },   
    { filename: 'IMG_7248.jpeg', title: 'Bench 1' },   
    { filename: 'IMG_7249.jpeg', title: 'Sink' },   
    { filename: 'IMG_7251.jpeg', title: 'Bench 3' },   
    { filename: 'IMG_7257.jpeg', title: 'Fume hood' },   
    { filename: 'IMG_7253.jpeg', title: 'Vacuum, Gas, Air' },   
    { filename: 'IMG_7258.jpeg', title: 'Vacuum' },   
    { filename: 'BSL2_1.jpeg', title: 'BSL2 Lab View' },   
];

const useStyles = makeStyles({
  section: {
    display: 'grid',
    rowGap: '1.5rem',
  },
})

export const PhotoSection = () => {
  const styles = useStyles()
  return (
    <section className={styles.section}>
      <h1>Photos</h1>
      <Carousel>
        <CarouselViewport>
          <CarouselSlider>
            {photo.map((img, index) => (
              <CarouselCard key={index}>
                <Image
                  src={`${ASSETS_BASE}equipment/${img.filename}`}
                  alt={img.title ?? `Photo ${index + 1}`}
                  width={600}
                  height={400}
                  fit="contain"
                />
                {img.title && <p>{img.title}</p>}
              </CarouselCard>
            ))}
          </CarouselSlider>
        </CarouselViewport>
        <CarouselNavContainer>
          <CarouselNav>
            {index => (
              <CarouselNavImageButton
                key={index}
                image={{ src: `${ASSETS_BASE}equipment/${photo[index].filename}` }}
              />
            )}
          </CarouselNav>
        </CarouselNavContainer>
      </Carousel>
    </section>
  )
}
