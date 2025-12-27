import Image from "next/image";

import { BackgroundRippleEffect } from "@/app/components/ui/background-ripple-effect";
import { TypewriterEffect } from "@/app/components/ui/typewriter-effect";
import { TextGenerateEffect } from "@/app/components/ui/text-generate-effect";

export default function Home() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden flex items-center">
      {/* Background */}
      <BackgroundRippleEffect />

      {/* Foreground */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          {/* LEFT SIDE */}
          <div className="max-w-xl -mt-8">
            <TypewriterEffect
              words={[
                { text: "Simplifying", className: "!text-[#008000]" },
                { text: "Solutions", className: "!text-[#008000]" },
                { text: "for", className: "!text-[#008000]" },
                { text: "modern", className: "!text-[#008000]" },
                { text: "Farmers.", className: "!text-[#008000]" },
              ]}
              className="text-left"
              cursorClassName="bg-[#008000]"
            />

            {/* PART 2 */}
            <TextGenerateEffect
              words="Smarter decisions, better harvests—powered by Krishak’s data-driven recommendations."
              className="mt-16 max-w-lg text-2xl [&_span]:!text-[#4b6b3c]"
              duration={0.6}
            />
            <button
  className="
    mt-12
    ml-18
    px-6 py-2
    border-2 border-black
    uppercase
    bg-green-700 text-white
    text-sm font-semibold
    transition-all duration-150
    shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)]
    active:translate-x-[4px]
    active:translate-y-[4px]
    active:shadow-none
    hover:bg-green-600
  "
>
  Get Recommendation
</button>

          </div>

          {/* RIGHT SIDE (empty for now) */}
          <div />
        </div>
      </div>
    </section>
  );
}