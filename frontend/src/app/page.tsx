import masti from "@/assets/img/tp.gif";
import masti2 from "@/assets/img/tp2.gif";
import masti3 from "@/assets/img/tp3.gif";

export default function Home() {
  return (
    <>
      <title>ProxyProof | Home</title>
      {(() => {
        const imgs = [masti, masti2, masti3];
        const src = imgs[Math.floor(Math.random() * imgs.length)];
        return (
          <div className="w-full flex items-center justify-center">
            <img src={src.src} className="max-h-[80vh] object-contain" alt="" />
          </div>
        );
      })()}
    </>
  );
}