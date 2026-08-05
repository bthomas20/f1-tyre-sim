import { useEffect, useRef } from "react";

const TRACK_PATH = `
  M 88 530
  L 820 530
  C 862 530 890 513 904 482
  C 918 451 909 419 891 386
  L 721 112
  C 698 75 665 57 631 63
  C 599 69 579 94 568 125
  C 555 161 527 196 522 226
  C 517 259 537 280 569 294
  C 610 312 660 331 678 365
  C 695 397 676 426 638 430
  L 235 430
  C 207 430 192 416 195 395
  C 199 372 220 350 248 348
  C 301 344 377 367 439 376
  C 467 380 487 369 484 349
  C 481 331 461 316 431 296
  L 358 246
  C 340 234 331 220 334 201
  L 338 178
  C 341 158 330 147 310 143
  L 279 136
  C 246 128 216 109 194 88
  L 175 70
  C 153 49 130 51 124 76
  L 82 392
  C 80 411 90 428 105 445
  L 84 467
  C 67 485 68 512 88 530
`;

const TURN_MARKERS = [
  { number: 1, x: 78, y: 542 },
  { number: 2, x: 126, y: 480 },
  { number: 3, x: 79, y: 404 },
  { number: 4, x: 151, y: 54 },
  { number: 5, x: 273, y: 148 },
  { number: 6, x: 354, y: 175 },
  { number: 7, x: 342, y: 246 },
  { number: 8, x: 486, y: 356 },
  { number: 9, x: 254, y: 335 },
  { number: 10, x: 190, y: 411 },
  { number: 11, x: 711, y: 393 },
  { number: 12, x: 541, y: 274 },
  { number: 13, x: 612, y: 83 },
  { number: 14, x: 918, y: 477 },
  { number: 15, x: 858, y: 547 },
];

const TEAM_COLORS = {
  Ferrari: {
    primary:   "#e10600",
    secondary: "#ffd200",
  },
  McLaren: {
    primary:   "#ff8700",
    secondary: "#47c7fc",
  },
  Mercedes: {
    primary:   "#c8c8c8",
    secondary: "#00d2be",
  },
  "Red Bull": {
    primary:   "#1e41ff",
    secondary: "#e10600",
  },
  "Aston Martin": {
    primary:   "#006f62",
    secondary: "#cedc00",
  },
  Williams: {
    primary:   "#005aff",
    secondary: "#ffffff",
  },
};
export default function BahrainTrack({
  selectedTurn,
  onTurnSelect,
  isSimulating,
  onLapComplete,
  team,
}) {
  const svgRef = useRef(null)
  const animationRef = useRef(null)
  const teamColors = TEAM_COLORS[team] ?? TEAM_COLORS.Ferrari;

  useEffect(() => {
    const svg = svgRef.current

    if (!svg) return;

    if (isSimulating) {
      svg.unpauseAnimations();
    } else {
      svg.pauseAnimations();
    }
  }, [isSimulating]);

  useEffect(() => {
    const svg = svgRef.current

    if (!svg) return;

    svg.setCurrentTime(0);
    svg.pauseAnimations();
  }, []);

  useEffect(() => {
    const animation = animationRef.current;

    if (!animation || !onLapComplete) return;

    const handleRepeat = () => {
      onLapComplete();
    };
  
    animation.addEventListener("repeatEvent", handleRepeat);

    return () => {
       animation.removeEventListener("repeatEvent", handleRepeat);
    };
  }, [onLapComplete]);

  return (
    <svg
      ref={svgRef}
      className="bahrain-track"
      viewBox="0 0 960 600"
      role="img"
      aria-label="Interactive Bahrain International Circuit map"
    >
      <defs>
        <filter
          id="trackGlow"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
        >
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter
          id="markerGlow"
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="trackStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#dce7f5" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>

      </defs>

      <g className="pit-complex" pointerEvents="none">
	<path
	  className="pit-lane"
	  d="
	    M 835 514
	    C 810 492 785 492 750 492
	    L 320 492
	    C 150 492 185 530 160 525
	  "
	/>
	<path
	  className="pit-divider"
	  d="
	    M 810 512
	    L 300 512
	  "
	/>

	<g className="pit-building" pointerEvents="none">
	    <rect
	      x="300"
	      y="450"
	      width="470"
	      height="34"
	      rx="5"
	      className="garage-building"
	    />
	    <rect
	      x="300"
	      y="450"
	      width="470"
	      height="5"
	      className="garage-roof"
	    />
	    <line
	      x1="300"
	      y1="485"
	      x2="770"
	      y2="485"
	      className="garage-shadow"
	    />
	    <g className="garage-dividers">
	      {Array.from({ length: 10}, (_, index) => {
		const buildingX = 300;
		const buildingY = 450;
		const buildingWidth = 470;
		const buildingHeight = 34;
		const dividerX = 
		  buildingX + ((index + 1) * buildingWidth) / 11;

		return (
		  <line
		    key={index}
		    x1={dividerX}
		    y1={buildingY}
		    x2={dividerX}
		    y2={buildingY + buildingHeight}
		    className="garage-divider"
		  />
		);
	      })}
	    </g>
	</g>
      </g>

      
      <path className="track-underlay" d={TRACK_PATH} />

      <path
	id="bahrainCircuitPath"
	className="track-main-line"
	d={TRACK_PATH}
	filter="url(#trackGlow)"
      />

      <g className="start-finish" transform="translate(690 510)">
	{Array.from({ length: 24}).map((_, index) => {
	  const row = Math.floor(index / 6);
	  const column = index % 6;

          return (
            <rect
              key={index}
              x={column * 5}
              y={row * 5}
              width="5"
              height="5"
              className={
                (row + column) % 2 === 0
                  ? "start-light-square"
                  : "start-dark-square"
              }
            />
          );
        })}
       </g>

      <g className="direction-indicator" aria-label="Anti-clockwise direction">
        <line x1="678" y1="559" x2="615" y2="559" />
        <polyline points="630,547 615,559 630,571" />
      </g>

      <g 
	className="lap-car" 
	filter="url(#markerGlow)"
	transform="rotate(180)"
      >

	<rect
	   x="-16"
	   y="-9"
	   width="4"
	   height="18"
	   rx="1"
	   fill={teamColors.secondary}
	/>

	<path
	   className="lap-car-body"
	   fill={teamColors.primary}
	   d="
	     M 19 0
	     C 16 -2 14 -3 11 -4
	     L 7 -5
	     L 3 -8
	     L -4 -8
	     L -7 -5
	     L -13 -4
	     L -13 4
	     L -7 5
	     L -4 8
	     L 3 8
	     L 7 5
	     L 11 4
	     C 14 3 16 2 19 0
	     Z
	   "
	/>
	
	<rect
	   x="9"
	   y="-6"
	   width="3"
	   height="12"
	   rx="1"
	   fill={teamColors.secondary}
	/>

	<ellipse
	   className="lap-car-cockpit"
	      cx="0"
	      cy="0"
	      rx="4"
	      ry="5"
	      fill="#101722"
	/>

	<path
	   d="M 4 0 L -8 0"
	   stroke={teamColors.secondary}
	   strokeWidth="2"
	   strokeLinecap="round"
	/>

	<path
	   d="M -2 -4 Q 1 0 -2 4"
	   fill="none"
	   stroke="#d7e0ea"
	   strokeWidth="1.2"
	   strokeLinecap="round"
	/>

	<rect className="lap-car-wheel" x="-10" y="-11" width="7" height="4" rx="1" />
        <rect className="lap-car-wheel" x="-10" y="7" width="7" height="4" rx="1" />
        <rect className="lap-car-wheel" x="6" y="-10" width="6" height="4" rx="1" />
        <rect className="lap-car-wheel" x="6" y="6" width="6" height="4" rx="1" />

	<animateMotion
	   ref={animationRef}
	   dur="11s"
	   repeatCount="indefinite"
           rotate="auto"
           keyPoints="0.2;0;1;0.2"
           keyTimes="0;0.2;0.2;1"
           calcMode="linear"
         >
           <mpath href="#bahrainCircuitPath" />
         </animateMotion>

      </g>

      {TURN_MARKERS.map((turn) => {
        const isSelected = selectedTurn === turn.number;

        return (
          <g
            key={turn.number}
            className={`turn-marker ${isSelected ? "selected" : ""}`}
            transform={`translate(${turn.x} ${turn.y})`}
            role="button"
            tabIndex="0"
            aria-label={`Select turn ${turn.number}`}
            onClick={(event) => {
              event.stopPropagation();
              onTurnSelect(turn.number);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onTurnSelect(turn.number);
              }
            }}
          >
            <circle className="turn-marker-hitbox" r="24" />
            <circle className="turn-marker-ring" r="17" />
            <text
              className="turn-marker-text"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {String(turn.number).padStart(2, "0")}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
