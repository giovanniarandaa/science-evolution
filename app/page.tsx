import { Mesa } from "@/components/mesa/Mesa";
import { procesoFuego } from "@/content/processes/fuego";

export default function Home() {
  return <Mesa process={procesoFuego} />;
}
