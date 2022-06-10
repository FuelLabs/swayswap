import { Header } from "../components/Header";
import { HomeHero } from "../components/HomeHero";

export function HomePage() {
  return (
    <div className="homePage">
      <Header />
      <HomeHero />
    </div>
  );
}
