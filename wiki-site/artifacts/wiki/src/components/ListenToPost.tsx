import { Headphones } from "lucide-react";

/**
 * "Listen to this post": the owner's own recorded reading of the post, shown under the post's
 * header only when content/audio holds a file named after the post's slug. A plain browser audio
 * control, so it works with the keyboard and screen readers and plays nothing until pressed.
 */
export function ListenToPost({ src }: { src: string }) {
  return (
    <div className="mt-6 bg-black border-2 border-gray-800 p-4">
      <div className="flex items-center gap-3 font-mono text-sm text-gray-300 mb-3">
        <Headphones size={18} className="text-accent shrink-0" />
        <span>Listen to this post, read by the author.</span>
      </div>
      <audio controls preload="none" src={src} className="w-full">
        <a href={src}>Download the recording</a>
      </audio>
    </div>
  );
}
