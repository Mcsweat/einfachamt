import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EinfachAmt",
    short_name: "EinfachAmt",
    description: "Behördenbriefe in 30 Sekunden verstehen",
    start_url: "/",
    display: "standalone",
    background_color: "#f2f2f7",
    theme_color: "#0a84ff",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
