---
name: "Forest Math Adventure"
description: "A sunlit forest trail turns arithmetic choices into movement and wayfinding."
colors:
  forest-deep: "#214c36"
  forest-ink: "#183b2a"
  forest-mid: "#47794c"
  canopy-leaf: "#9acb70"
  path-gold: "#f1cd51"
  path-gold-hover: "#f7d966"
  action-ink: "#304529"
  cream: "#f4f0d7"
  surface: "#e6edce"
  warning: "#a74438"
  pause-forest: "#315d41"
  touch-forest: "#315b40"
  sign-wood: "#9a653d"
  sign-trim: "#d2a760"
  trail-sand: "#cab77c"
  completed-leaf: "#c5df91"
  world-canvas: "#91c778"
typography:
  display:
    fontFamily: "Baloo 2, M PLUS Rounded 1c, sans-serif"
    fontSize: "clamp(42px, 4vw, 58px)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.045em"
  answer:
    fontFamily: "Baloo 2, M PLUS Rounded 1c, sans-serif"
    fontSize: "clamp(22px, 3.2vw, 40px)"
    fontWeight: 800
    lineHeight: 1
  headline:
    fontFamily: "M PLUS Rounded 1c, Noto Sans TC, Microsoft JhengHei, sans-serif"
    fontSize: "30px"
    fontWeight: 800
    lineHeight: 1.2
  title:
    fontFamily: "M PLUS Rounded 1c, Noto Sans TC, Microsoft JhengHei, sans-serif"
    fontSize: "22px"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  body:
    fontFamily: "M PLUS Rounded 1c, Noto Sans TC, Microsoft JhengHei, sans-serif"
    fontSize: "16px"
    fontWeight: 400
  label:
    fontFamily: "M PLUS Rounded 1c, Noto Sans TC, Microsoft JhengHei, sans-serif"
    fontSize: "12px"
    fontWeight: 800
  button:
    fontFamily: "M PLUS Rounded 1c, Noto Sans TC, Microsoft JhengHei, sans-serif"
    fontSize: "16px"
    fontWeight: 900
rounded:
  keycap: "6px"
  control: "14px"
  sign-board: "14px"
  action: "17px"
  overlay: "24px"
  mission-panel: "27px"
  world-window: "29px"
  compact-mission: "21px"
  compact-world: "22px"
spacing:
  compact: "8px"
  small: "12px"
  medium: "18px"
  large: "24px"
  overlay-inset: "34px"
components:
  button-primary:
    backgroundColor: "{colors.path-gold}"
    textColor: "{colors.action-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.action}"
    padding: "13px 23px"
    height: "54px"
  button-primary-hover:
    backgroundColor: "{colors.path-gold-hover}"
  button-secondary:
    backgroundColor: "{colors.pause-forest}"
    textColor: "#fff4d1"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "10px 15px"
  button-touch:
    backgroundColor: "{colors.touch-forest}"
    textColor: "#fff2c3"
    rounded: "{rounded.control}"
  mission-card:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.forest-ink}"
    rounded: "{rounded.mission-panel}"
    padding: "34px"
  level-progress:
    backgroundColor: "{colors.path-gold}"
    textColor: "{colors.action-ink}"
    size: "34px"
  answer-sign:
    backgroundColor: "{colors.sign-wood}"
    textColor: "#fff5d7"
    rounded: "{rounded.sign-board}"
    width: "182px"
    height: "142px"
  pause-overlay:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.forest-deep}"
    rounded: "{rounded.overlay}"
    padding: "{spacing.overlay-inset}"
---

# Design System: Forest Math Adventure

## Overview

**Creative North Star: "The Sunlit Answer Trail."**

The interface feels like a welcoming forest clearing with a clear next step. A deep green rail frames a warm paper-colored mission card; beyond it, a bright canopy opens into three wooden answer markers on a winding path. Rounded, sturdy lettering keeps arithmetic and Traditional Chinese instructions easy for young learners to scan.

The scene does the teaching through movement: the explorer starts at the trailhead, the answer signs sit at distinct points, and a correct choice briefly lights the route in gold. The page stays compact and legible around that playful world, with the level rail, score, prompt, and touch controls always serving the next decision.

**Key Characteristics:**
- Forest greens frame the play area; cream surfaces keep instructions calm and readable.
- Warm trail gold marks the main action, the current level, and the successful route.
- Rounded display numerals make equations and answer choices the clearest objects.
- The three wooden signs make answer selection part of the forest scene.

## Colors

The palette layers canopy greens with a warm directional accent, paper-like information surfaces, and a restrained warning tone.

### Primary
- **Deep Canopy:** The dark green anchors the top rail, major headings, and foreground ink.
- **Leaf Clearing:** The bright leaf green fills the playable world behind the illustrated foliage.
- **Forest Midtone:** A lighter green supports hover and other active interface states.
- **Trail Gold:** The main action and active progress marker use this clear, warm signal.

### Secondary
- **Timber Sign:** The answer boards use a warm, medium wood face, edged with a lighter timber trim.
- **Path Sand:** The branching route uses muted tan so the gold success flash remains distinct.

### Neutral
- **Warm Paper:** Mission, hint, and overlay surfaces use a soft cream with dark forest text.
- **Forest Mist:** The app shell uses a pale green-gray field outside the game world.
- **Rust Feedback:** Incorrect answers use a muted rust tone, separate from the success green.

**The Gold Wayfinding Rule.** Use trail gold for the primary action, active stage marker, and correct-route flash; keep it out of long body copy.

## Typography

**Display Font:** Baloo 2, with M PLUS Rounded 1c and a sans-serif fallback  
**Body Font:** M PLUS Rounded 1c, with Noto Sans TC, Microsoft JhengHei, and sans-serif fallbacks  
**Label/Mono Font:** No separate mono face; numeric score and equation display use tabular numerals.

**Character:** The rounded display face gives equations a friendly, sturdy voice, while the body face keeps Traditional Chinese instructions clear and compact. The interface uses weight and scale to establish hierarchy instead of adding decorative type styles.

### Hierarchy
- **Display:** Heavy Baloo 2 numerals carry the equation; their size clamps with available width and preserves a single-line expression.
- **Answer:** Matching display numerals sit directly over the sign boards, so the choices read as part of the world.
- **Headline:** Rounded bold headings introduce pause and completion states.
- **Title:** The brand name and score use compact, confident display treatment.
- **Body:** Instruction and feedback copy stays short, high-contrast, and comfortably spaced.
- **Label:** Level names, question counts, and progress captions use smaller bold text; keep them in sentence case.

**The Numeral First Rule.** Keep the equation and answer numerals at display scale, with instructions and progress labels supporting them.

## Layout

The wide layout is a compact dashboard above a two-part play surface. A 94px top rail holds the brand, five-stage progress, score, and pause action. Below it, the mission card occupies roughly one quarter of the width beside the game world, with an 18px gap and 18px outer inset. The game window has a 420px minimum height on wide screens.

The canvas places three answer markers at about 19%, 50%, and 81% of the scene width. The explorer starts near the center at 79% of the scene height; a central trail junction branches toward each marker. Keep these open spatial relationships so the signs remain reachable and the route stays legible.

At 1080px and below, the column balance shifts and the touch pad appears. At 740px and below, the mission card stacks above the game scene; the level rail moves to its own header row, and the scene retains a 380px minimum height. At 390px and below, the page inset and touch pad tighten, with the world retaining a 350px minimum height. The Phaser sign scale switches to its compact sizing below 620px.

## Elevation & Depth

Depth comes from soft, olive-tinted shadows rather than borders or high contrast. Resting shadows separate the cream mission card and green game window from the pale shell; the central pause card lifts above a darkened, lightly blurred scene. Button shadows respond to hover and press, while the correct-route glow is a short event cue rather than a permanent layer.

### Shadow Vocabulary
- **Mission card:** 0 10px 22px rgb(62 75 37 / 16%) separates the instruction surface from the shell.
- **Game window:** 0 10px 22px rgb(57 83 40 / 19%) gives the forest scene its own boundary.
- **Primary action:** 0 6px 13px rgb(120 91 20 / 28%) at rest; the hover and pressed states tighten or soften this lift.
- **Touch controls:** 0 4px 10px rgb(21 49 32 / 34%) keeps the pad legible over the canvas.
- **Pause card:** 0 12px 22px rgb(41 61 36 / 24%) separates the message from the dimmed scene.

**The Path Responds Rule.** On a correct answer, briefly light the route from the explorer to the selected marker, then return the forest to its resting state.

## Shapes

The interface uses generously rounded panels and controls, with no sharp decorative corners. The mission and game window are the largest soft rectangles; the answer board is a rounded timber plaque with an inset trim, and the five level markers remain circular. The three-by-three touch pad keeps its empty corners, so its four direction buttons read as a clear compass rather than a solid keypad. Compact screens reduce the panel and scene radii without changing their silhouettes.

## Components

### Buttons

The primary action is a tactile, warm-gold button with a clear dark label. Its baseline shape and padding come from the button-primary token. Hover lifts it and brightens the gold; pressing nudges it down and reduces the shadow. The global keyboard focus treatment is a 4px copper outline with a 4px offset.

The pause action uses a forest-green surface and cream lettering. Hover shifts it to the mid forest green and lifts it slightly; the disabled opening state dims the control rather than removing it. On compact screens, the main action shortens and uses the control radius.

### Mission Card

The warm-paper mission card groups the current level, equation, movement instruction, round progress, feedback, and start action. It uses the mission-panel shape token, with the padding tightening as the card stacks on mobile.

The round-progress rail is a low, rounded track with a leaf-green fill. It advances in place so question progress does not compete with the five-stage navigation.

### Five-Level Progress Rail

This is a navigation landmark, not a generic breadcrumb. Five circular markers connect across the top rail. The active stage uses trail gold and a slight scale-up; completed stages use pale leaf green; upcoming stages remain darker and quieter. On mobile, the rail moves under the brand while score and pause stay at the right.

### Answer Signs

The answer choices are physical wooden signboards in the Phaser scene, with large Baloo 2 numerals overlaid in HTML. Their positions form a shallow fork above the trailhead. A wrong sign fades and becomes unavailable; the correct sign causes the path to flash gold before the next question.

### Touch D-Pad

The four directional controls sit over the lower-right corner of the game world. Each is a forest-green square with a cream outline, rounded corners, and a centered arrow. The pad appears at tablet and smaller widths, contracts on narrow phones, and uses pressed color and a small downward movement for tactile feedback.

### Pause Overlay

Pausing places a dark green translucent veil with a subtle blur over the game world, then centers a cream message card. The card is limited to a readable width, and its gold action returns the student to the trail.

## Do's and Don'ts

### Do:
- **Do** keep the primary action gold and use dark forest ink for its label.
- **Do** keep the equation and answer choices the largest typographic signals in their respective regions.
- **Do** preserve three physical answer signs and the brief gold route flash for a correct choice.
- **Do** keep the five-stage rail visible and retain a touch direction pad at compact widths.

### Don't:
- **Don't** replace the trail-sign choice with a row of quiz cards; movement is the answer-selection pattern.
- **Don't** make the progress rail, score, and equation compete at the same type size.
- **Don't** remove the visible touch pad on screens where the interface currently presents it.
