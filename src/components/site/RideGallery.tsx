import Image from "next/image";

/**
 * The weekend in order: the climb, the camp, the night, the morning, then the
 * falls and the boat house on the way home.
 *
 * Campsite shots are the team's own. Location shots were supplied separately —
 * three of the supplied set were left out on purpose, see the note in the chat:
 * two carried other people's watermarks and one was not Kolli Hills.
 *
 * Masonry rather than a cropped grid: much of this is portrait, and cropping
 * square throws away the sky, the mist and the drop into the valley.
 */
const SHOTS = [
  // the climb
  { src: "/gallery/hairpins-aerial.jpg", w: 1726, h: 1028, alt: "The ghat road stacked up the hillside, bend after bend" },
  { src: "/gallery/hairpin-bend.jpg", w: 1080, h: 810, alt: "A single hairpin bend cut into the forest from above" },
  { src: "/gallery/hairpins-from-above.jpg", w: 495, h: 619, alt: "The full run of hairpin bends seen from the air" },
  { src: "/gallery/valley-vista.jpg", w: 1080, h: 810, alt: "The valley opening out between two ridges" },

  // camp
  { src: "/gallery/tent-view.jpg", w: 900, h: 1200, alt: "A tent pitched facing the forest and the hills beyond" },
  { src: "/gallery/campfire-night.jpg", w: 900, h: 1200, alt: "The group gathered around the campfire under string lights" },
  { src: "/gallery/the-group.jpg", w: 1200, h: 900, alt: "Riders together at the campsite after the climb" },
  { src: "/gallery/campfire-circle.jpg", w: 900, h: 1200, alt: "Riders sitting in a circle around the fire at night" },
  { src: "/gallery/camp-signpost.jpg", w: 900, h: 1200, alt: "Hand-painted camp signpost pointing to the tents, dining and campfire" },

  // morning
  { src: "/gallery/tents-in-mist.jpg", w: 900, h: 1200, alt: "Tents pitched in early morning mist" },
  { src: "/gallery/sunrise-camp.jpg", w: 1200, h: 900, alt: "Sunrise over the tents, mist lying in the valley below" },
  { src: "/gallery/chai-in-mist.jpg", w: 900, h: 1200, alt: "A cup of chai held up against the morning mist" },
  { src: "/gallery/camp-dining.jpg", w: 900, h: 1200, alt: "Breakfast being served under the camp dining shelter" },
  { src: "/gallery/hammock-fog.jpg", w: 1200, h: 901, alt: "Hammocks strung between trees in thick fog" },
  { src: "/gallery/hammock-dog.jpg", w: 900, h: 1200, alt: "A rider in a hammock saying hello to the camp dog" },
  { src: "/gallery/valley-view.jpg", w: 673, h: 1200, alt: "Sitting out at the edge of camp looking over the valley" },

  // day two
  { src: "/gallery/falls-descent.jpg", w: 1080, h: 1350, alt: "The stepped descent towards the Agaya Gangai falls, cloud over the ridge" },
  { src: "/gallery/agaya-gangai-falls.jpg", w: 495, h: 619, alt: "The Agaya Gangai falls dropping into the pool below" },
  { src: "/gallery/boat-house.jpg", w: 1024, h: 768, alt: "Pedal boats out on the lake at the boat house" },
  { src: "/gallery/boat-house-lake.jpg", w: 636, h: 415, alt: "A pedal boat on the quiet end of the boat house lake" },
];

export function RideGallery() {
  return (
    <div className="columns-2 gap-md md:columns-3 lg:columns-4 [&>*]:mb-md">
      {SHOTS.map((shot, i) => (
        <figure
          key={shot.src}
          className="break-inside-avoid overflow-hidden rounded-3xl bg-card"
        >
          <Image
            src={shot.src}
            alt={shot.alt}
            width={shot.w}
            height={shot.h}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            loading={i < 4 ? "eager" : "lazy"}
            className="h-auto w-full"
          />
        </figure>
      ))}
    </div>
  );
}
