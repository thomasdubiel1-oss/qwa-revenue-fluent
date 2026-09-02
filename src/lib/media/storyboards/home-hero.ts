/**
 * PHASE 4A — LTX storyboard package for the homepage hero (`home-hero`).
 *
 * Manual handoff: LTX Studio is not API-connected in this project. Every field
 * below is written to be copied into LTX by a human. Anything produced on a
 * personal/free LTX plan is prototype_only and can never reach a public route.
 */
import type { StoryboardPackage } from "../storyboard";

const GLOBAL_NEGATIVE = [
  "no text, no captions, no numbers, no typography of any kind",
  "no logos, no brand marks, no fake customer logos",
  "no UI screenshots, dashboards, charts, graphs or fake metrics",
  "no people, faces, hands, offices, handshakes or stock-business imagery",
  "no neon, cyberpunk, holograms, sci-fi HUD, lens flares, light streak spectacle",
  "no heavy glassmorphism, no chrome, no glossy 3D plastic",
  "no particle storms, no smoke, no fog, no bokeh clutter",
  "no morphing between unrelated objects, no impossible or shifting geometry",
  "no hard cuts, no whip pans, no zoom punches, no camera shake",
  "no colour outside paper white, soft warm neutrals, ink grey-black and one deep teal",
  "no saturated blues, purples, oranges or gradient rainbows",
  "no watermark, no vignette, no film grain overlay, no chromatic aberration",
];

const VISUAL_DIRECTION = [
  "Paper-white to soft warm neutral ground; the environment is calm and bright, never dark.",
  "Fine dark ink linework, hairline weight, drawn with drafting precision rather than glow.",
  "One restrained deep-teal accent, used only where meaning changes. Never more than ~8% of frame.",
  "Subtle dimensionality: shallow depth, soft directional studio light, gentle contact shadow. Physical, not rendered-looking.",
  "Abstract and systemic. The subject is a structure of connected paths, not objects or products.",
  "Motion is deliberate and eased — arrivals settle, nothing bounces, nothing pulses decoratively.",
  "The clip must sit behind and beside website copy without competing: low contrast at the left third, activity concentrated centre-right.",
];

export const HOME_HERO_STORYBOARD: StoryboardPackage = {
  mediaId: "home-hero",
  title: "Homepage hero — signals resolve into a returning loop",
  arc: "Scattered customer signals enter → they organise into one intelligent operating layer → the lead/revenue workflow visibly progresses → attribution closes the loop by returning revenue to its source → the composition resolves and restarts seamlessly.",
  runtimeSeconds: 15,
  loopStrategy:
    "Designed as a closed cycle, not a clip with an ending. Shot 1 and the final second of shot 7 are the SAME frame state: an empty paper field with the faint dormant spine centred, identical light, identical camera position. Produce shot 7 slightly long (~2.0s) and trim on the frame that matches shot 1 exactly; cross-dissolve the last 6 frames into the first 6 as insurance. No element may be mid-travel at the seam, and the deep-teal accent must be fully faded at both ends so the colour does not pop on restart.",
  visualDirection: VISUAL_DIRECTION,
  globalNegative: GLOBAL_NEGATIVE,
  apiConnected: false,
  handoffNotes:
    "LTX Studio is registered as a manual_handoff planning provider. There is no LTX API call in this codebase and no LTX key is required or stored. Paste the master prompt into LTX Studio for storyboard frames first; only after storyboard approval run the prototype prompt for rough motion. Treat all personal/free-plan output as prototype_only.",

  shots: [
    {
      n: 1,
      title: "Rest state",
      seconds: 1.8,
      composition:
        "Wide, near-flat view of an empty paper-white field. A single faint horizontal ink spine sits slightly below centre, right of frame centre. Left third is almost empty.",
      action:
        "Nothing enters yet. The light shifts by a few percent, as if a room is waking. The spine's ink density lifts very slightly.",
      camera: "Locked. No movement.",
      transitionIn: "Loop point — matches the final frame of shot 7 exactly.",
      transitionOut: "Hold, then the first traces arrive over the last 4 frames.",
      desktopFraming:
        "4:3. Spine occupies the centre-right 55% of width; left 30% deliberately quiet for headline copy.",
      mobileFraming:
        "4:5 centre crop. Spine must remain fully inside the crop with margin; nothing important within 12% of any edge.",
      prompt:
        "Locked wide shot of a clean paper-white surface with a soft warm neutral falloff, lit by gentle diffused studio light from the upper left. A single hairline dark ink line rests horizontally just below centre, slightly right of frame centre, with a faint contact shadow. Extremely minimal, calm, precise, architectural. Light warms almost imperceptibly. No other elements.",
      negative:
        "no movement of the line, no glow, no particles, no colour accent yet, no text, no objects",
      continuity:
        "This exact frame is the loop anchor. Note the light direction and spine position; every later shot inherits them.",
    },
    {
      n: 2,
      title: "Scattered signals arrive",
      seconds: 2.4,
      composition:
        "Five thin ink traces enter from the left and lower-left edges at different heights, unaligned and irregularly spaced.",
      action:
        "Traces draw inward at different speeds and slightly different angles — deliberately uncoordinated, the visual of scattered demand. Each ends in a small dark dot that settles with a faint shadow.",
      camera: "Very slow push in, under 3% over the shot.",
      transitionIn: "Traces begin drawing; no cut.",
      transitionOut: "All five dots hold still for ~6 frames before shot 3 begins.",
      desktopFraming:
        "Entry points spread across the left half but terminate right of the copy column so the headline never sits on a busy area.",
      mobileFraming:
        "In 4:5, reduce read to three visible entry traces by keeping the outermost two near the crop edge — the crop losing them must not break the story.",
      prompt:
        "Five hairline dark ink traces draw inward from the left and lower-left edges of a paper-white field at different speeds and slightly different angles, each ending in a small dark dot that settles with a soft contact shadow. Uncoordinated, irregular, hand-drafted precision. Diffused studio light from upper left. Very slow, barely perceptible push in.",
      negative:
        "no symmetry, no evenly spaced fan, no glowing tips, no sparks, no colour, no speed lines",
      continuity:
        "Trace entry heights are reused in shot 6 as the return destinations. Keep the top trace the longest.",
    },
    {
      n: 3,
      title: "Convergence into one layer",
      seconds: 2.4,
      composition:
        "The five traces bend toward a single calm horizontal structure that forms along the spine — one continuous operating layer.",
      action:
        "Traces curve and merge into the spine one after another, not all at once. As the last one joins, the spine thickens marginally and gains a quiet ordered rhythm of tick marks. The first deep-teal tint appears at the merge point only.",
      camera: "Push settles and stops. Camera is static by the end of the shot.",
      transitionIn: "Continuous from the held dots.",
      transitionOut: "Structure holds, fully formed and level.",
      desktopFraming: "Merged spine sits on the horizontal third, centre-right.",
      mobileFraming:
        "Merge point must be inside the middle 60% of the 4:5 crop; the spine reads as the dominant element.",
      prompt:
        "Five hairline ink traces curve and merge one after another into a single continuous horizontal structure on a paper-white field. The merged line gains a fine ordered rhythm of small tick marks and a subtle depth shadow. A single restrained deep-teal tint appears only at the point of convergence. Calm, architectural, deliberate easing. Camera comes to rest.",
      negative:
        "no burst, no flash at merge, no expanding rings, no teal spreading across the frame, no lens flare",
      continuity:
        "Spine thickness and tick rhythm established here are constant for the rest of the loop.",
    },
    {
      n: 4,
      title: "The work progresses",
      seconds: 2.4,
      composition:
        "A single deep-teal marker travels left to right along the spine, passing four subtle waypoint notches.",
      action:
        "The marker advances with a measured, confident cadence, pausing microscopically at each notch; each passed notch darkens from grey to ink. This is the lead moving through the workflow without literal iconography.",
      camera: "Static. A very slight parallax in the background neutral only.",
      transitionIn: "Marker separates smoothly from the merge point.",
      transitionOut: "Marker reaches the right end and stops cleanly.",
      desktopFraming: "Full travel visible; the right end sits inside 88% of frame width.",
      mobileFraming:
        "In 4:5 the spine may be shortened to three notches — keep the travel fully inside the crop, never running off-edge.",
      prompt:
        "A small deep-teal marker travels smoothly left to right along a fine dark horizontal line on paper white, passing four subtle notches; each notch it passes darkens from light grey to ink. Measured, confident cadence with micro-pauses. Static camera, shallow depth, soft studio light. Restrained and precise.",
      negative:
        "no trailing comet tail, no glow trail, no bouncing, no acceleration spikes, no icons, no labels",
      continuity: "Marker size and teal value must match the accent introduced in shot 3 exactly.",
    },
    {
      n: 5,
      title: "Value forms",
      seconds: 2.0,
      composition:
        "At the right end of the spine, a small solid form assembles — a compact, weighty shape resolving from a few clean planes.",
      action:
        "The form settles with a real contact shadow and a slight increase in local light, reading as a completed sale — a thing of substance, not a graphic.",
      camera: "Static, or an extremely slow 2% drift right.",
      transitionIn: "Grows out of the marker's stopping point.",
      transitionOut: "Form holds; one teal edge remains lit.",
      desktopFraming: "Form sits in the right third, well clear of the copy column.",
      mobileFraming: "In 4:5 the form must sit above the lower 20% safe zone.",
      prompt:
        "A small solid geometric form assembles from a few clean planes at the end of a fine dark line on paper white, settling with a soft realistic contact shadow and a gentle local lift in light. One edge carries a restrained deep-teal accent. Substantial, physical, quietly premium. Minimal camera drift.",
      negative:
        "no coins, no currency symbols, no cart, no trophy, no shiny metal, no reflections, no sparkle",
      continuity:
        "Form's footprint must not overlap the spine's right terminus so shot 6 can leave from underneath it.",
    },
    {
      n: 6,
      title: "Revenue returns to its source",
      seconds: 2.6,
      composition:
        "One continuous deep-teal path leaves the form, runs back beneath the spine, and arrives at the original entry traces on the left.",
      action:
        "The signature beat. The return path draws backward in a single unbroken stroke — clearly reversing direction — and reaches the entry dot of the top trace, which lifts to teal on arrival. Two adjacent entry dots register a fainter arrival a beat later.",
      camera: "Static. Nothing else in frame moves during the return.",
      transitionIn: "Path emerges from under the settled form.",
      transitionOut: "Arrival holds for ~8 frames, the longest hold in the loop.",
      desktopFraming:
        "The return path is the only element allowed to cross into the left third, and it does so as a single thin line — safe behind headline copy.",
      mobileFraming:
        "In 4:5, the return must still visibly reach a source dot inside the crop; do not let the arrival point sit outside the frame.",
      prompt:
        "A single continuous deep-teal line leaves a small solid form, travels backward beneath a fine dark horizontal line, and arrives at one of the original entry points on the left of a paper-white field. The destination dot lifts from ink to deep teal as the line arrives; two nearby dots register a fainter change a moment later. Unbroken single stroke, clearly reversing direction, calm and deliberate. Static camera.",
      negative:
        "no branching, no multiple simultaneous returns, no pulses radiating outward, no glow bloom, no arrows",
      continuity:
        "This is the strongest beat of the loop — give it the longest hold. The teal must be the same value used in shots 3 to 5.",
    },
    {
      n: 7,
      title: "Resolve and restart",
      seconds: 1.4,
      composition: "The full structure visible for a moment, then quietly receding.",
      action:
        "Teal drains out first, then the return path and the entry traces fade in reverse order of arrival, then the form dissolves into the ground, leaving only the faint dormant spine of shot 1.",
      camera: "Locked. Returns to the exact shot 1 position.",
      transitionIn: "Continuous from the held arrival.",
      transitionOut:
        "Final frame is pixel-matched to shot 1; the loop restarts with no visible seam.",
      desktopFraming: "Identical to shot 1.",
      mobileFraming: "Identical to shot 1.",
      prompt:
        "The deep-teal accent fades out first, then the fine ink paths retract in reverse order and the small solid form dissolves softly into a paper-white surface, leaving a single faint horizontal ink line slightly below centre under diffused studio light. Ends exactly as it began. Slow, elegant, no flourish.",
      negative:
        "no fade to white or black, no wipe, no shrink-away, no final flash, no residual teal",
      continuity:
        "Render ~0.6s long and trim to the frame that matches shot 1; cross-dissolve the last 6 frames into the first 6.",
    },
  ],

  masterPrompt: [
    "A 15-second seamless silent loop, abstract and architectural, in a paper-white studio environment with soft warm neutral falloff and diffused directional light from the upper left. Everything is drawn in hairline dark ink with drafting precision, with shallow real depth and gentle contact shadows. A single restrained deep-teal accent is the only colour and appears only where meaning changes.",
    "The sequence: (1) an empty paper field rests, with one faint horizontal ink spine below centre; (2) five hairline traces enter from the left at uncoordinated speeds and angles, each settling into a small dark dot; (3) the traces curve and merge one by one into a single continuous horizontal structure that gains a fine ordered rhythm, with the first deep-teal tint at the merge point; (4) a small deep-teal marker travels left to right along the structure, passing four notches that darken from grey to ink as it passes; (5) a compact solid form assembles at the right end and settles with a real contact shadow, one edge carrying the teal accent; (6) a single unbroken deep-teal line leaves the form and travels backward beneath the structure to arrive at one of the original entry points, which lifts to teal on arrival, with two nearby dots responding faintly a beat later — this is the most important moment and holds the longest; (7) the teal drains, the paths retract in reverse order, the form dissolves, and the frame returns to the exact opening state so the loop restarts invisibly.",
    "Camera is essentially locked, with at most a 3% push in during the second beat that settles and never moves again. Motion is eased and deliberate: arrivals settle, nothing bounces, nothing pulses decoratively. Composition keeps the left third quiet and the activity centre-right so website copy can sit over it. Silent, no audio.",
    `AVOID: ${GLOBAL_NEGATIVE.join("; ")}.`,
  ].join("\n\n"),

  prototypePrompt: [
    "ROUGH MOTION PROTOTYPE — run only after storyboard approval. Draft quality is acceptable; timing and readability are what is being tested, not finish.",
    "15-second silent loop on paper white with hairline ink linework and a single deep-teal accent. Beat timing to test: 0.0-1.8s empty rest state with a faint horizontal spine; 1.8-4.2s five uncoordinated traces enter from the left and settle; 4.2-6.6s traces merge into one continuous horizontal structure, teal appears at the merge; 6.6-9.0s a teal marker travels the structure left to right past four darkening notches; 9.0-11.0s a small solid form assembles at the right end; 11.0-13.6s one unbroken teal line returns backward to an original entry point on the left, which lifts to teal and holds; 13.6-15.0s everything retracts in reverse and the frame returns to the opening state.",
    "Locked camera. Judge only: is the return beat legible in one glance, does the seam hold, and does the left third stay quiet enough for headline copy.",
    `AVOID: ${GLOBAL_NEGATIVE.join("; ")}.`,
  ].join("\n\n"),

  acceptanceChecklist: [
    {
      label: "Brand fit",
      test: "Reads as restrained California product design — paper, ink, one teal. Nothing on screen looks like generic AI-video spectacle, stock business imagery or a SaaS template.",
    },
    {
      label: "Story legibility",
      test: "A first-time viewer sees scatter → organise → progress → return without narration. The return beat is unmistakably backward.",
    },
    {
      label: "Continuity",
      test: "Light direction, spine position, line weight and teal value are identical across all seven shots. No element jumps between beats.",
    },
    {
      label: "Copy readability",
      test: "At full-bleed placement the left third stays low-contrast; headline, lede and buttons remain fully legible with no added scrim.",
    },
    {
      label: "Mobile crop",
      test: "The 4:5 crop keeps the merge point, the marker travel and the return arrival inside frame, with nothing critical within 12% of an edge.",
    },
    {
      label: "Loop quality",
      test: "Ten consecutive plays show no seam, no colour pop, no element mid-travel at the cut, and no drift in exposure.",
    },
    {
      label: "AI artefacts",
      test: "No warping lines, flickering edges, phantom text, unstable shadows, morphing geometry or frame-to-frame texture crawl.",
    },
    {
      label: "Technical delivery",
      test: "Silent, no audio track. Desktop 4:3 and mobile 4:5 masters, first frame usable as a poster, and file weight small enough to lazy-load without stalling the hero.",
    },
    {
      label: "Rights",
      test: "Produced or regenerated under a commercial plan with clearance recorded. Personal/free-plan output stays prototype_only and is never bound in the manifest.",
    },
  ],

  gate: "storyboard_ready",
};
