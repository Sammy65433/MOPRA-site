import "./LasileMap.css";

const maps = [
  { src: "/L'AsileGoogleMaps1.png", alt: "First map view of L’Asile" },
  { src: "/L'AsileGoogleMaps2.png", alt: "Second map view of L’Asile" },
  { src: "/L'AsileGoogleMaps3.png", alt: "Third map view of L’Asile" },
  { src: "/L'AsileGoogleMaps4.png", alt: "Fourth map view of L’Asile" },
  { src: "/L'AsileGoogleMaps5.png", alt: "Fifth map view of L’Asile" },
  { src: "/L'AsileGoogleMaps6.png", alt: "Sixth map view of L’Asile" },
];

export default function LasileMap() {
  return (
    <figure className="lasile-map">
      <div className="lasile-map__panels">
        {maps.map(({ src, alt }) => (
          <img key={src} src={src} alt={alt} loading="lazy" />
        ))}
      </div>

      <figcaption>Map views of L’Asile, Haiti</figcaption>
    </figure>
  );
}
