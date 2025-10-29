import * as React from "react";
import {
  makeStyles,
  Image,
  Carousel,
  type CarouselAnnouncerFunction,
  CarouselCard,
  CarouselNav,
  CarouselNavContainer,
  CarouselNavImageButton,
  CarouselSlider,
  CarouselViewport,
} from "@fluentui/react-components";

const useClasses = makeStyles({
  viewport: {
    /* Prevent image from overlapping nav buttons */
    marginBottom: "72px",
  },
  card: {
    boxSizing: "border-box",
    width: "100%",
    paddingLeft: "52px", // buffer for overlay controls
    paddingRight: "52px",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "auto",
    display: "block",
  },
});

type ImageDefinition = {
  previewUrl: string;
  url: string;
  label: string;
  disabled?: boolean;
};

const IMAGES: ImageDefinition[] = [
  {
    previewUrl:
      "https://fabricweb.azureedge.net/fabric-website/assets/images/swatch-picker/sea-swatch.jpg",
    url: "https://fabricweb.azureedge.net/fabric-website/assets/images/swatch-picker/sea-full-img.jpg",
    label: "sea",
  },
  {
    previewUrl:
      "https://fabricweb.azureedge.net/fabric-website/assets/images/swatch-picker/bridge-swatch.jpg",
    url: "https://fabricweb.azureedge.net/fabric-website/assets/images/swatch-picker/bridge-full-img.jpg",
    label: "bridge",
    disabled: true,
  },
  {
    previewUrl:
      "https://fabricweb.azureedge.net/fabric-website/assets/images/swatch-picker/park-swatch.jpg",
    url: "https://fabricweb.azureedge.net/fabric-website/assets/images/swatch-picker/park-full-img.jpg",
    label: "park",
  },
];

const getAnnouncement: CarouselAnnouncerFunction = (
  index: number,
  totalSlides: number
) => {
  return `Carousel slide ${index + 1} of ${totalSlides}`;
};

const App: React.FC = () => {
  const classes = useClasses();

  return (
    <Carousel groupSize={1} align="center" announcement={getAnnouncement}>
      <CarouselViewport className={classes.viewport}>
        <CarouselSlider>
          {IMAGES.map((image, index) => (
            <CarouselCard
              key={image.url}
              className={classes.card}
              aria-label={`${index + 1} of ${IMAGES.length}`}
            >
              <Image
                className={classes.image}
                src={image.url}
                alt={image.label}
              />
            </CarouselCard>
          ))}
        </CarouselSlider>
      </CarouselViewport>

      <CarouselNavContainer
        layout="overlay-expanded"
        next={{ "aria-label": "go to next" }}
        prev={{ "aria-label": "go to prev" }}
      >
        <CarouselNav>
          {(index) => (
            <CarouselNavImageButton
              key={IMAGES[index].label}
              image={{ src: IMAGES[index].previewUrl }}
              aria-label={`Go to ${IMAGES[index].label}`}
              disabled={IMAGES[index].disabled}
            />
          )}
        </CarouselNav>
      </CarouselNavContainer>
    </Carousel>
  );
};

export default App;
