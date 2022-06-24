import { relativeUrl } from "~/systems/Core";

export function WelcomeImage({ src }: { src: string }) {
  return (
    <div className="imgContainer">
      <img src={relativeUrl(src)} />
    </div>
  );
}
