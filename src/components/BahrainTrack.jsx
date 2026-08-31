import { useEffect, useRef, useState } from "react";

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

const buildTurnProgressMap = (path) => {
  const totalLength = path.getTotalLength();
  const turnProgressMap = {};

  TURN_MARKERS.forEach((turn) => {
    let closestProgress = 0;
    let closestDistance = Infinity;

    for (let i = 0; i <= 1000; i++) {
      const progress = i / 1000;
      const point = path.getPointAtLength(progress * totalLength);

      const distance = Math.hypot(
        point.x - turn.x,
        point.y - turn.y
        );
        
      if (distance < closestDistance) {
        closestDistance = distance;
        closestProgress = progress;
      }
    }
    turnProgressMap[turn.number] = closestProgress;
  });
  return turnProgressMap;
};

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
  Alpine: {
    primary:   "#0090FF",
    secondary: "#FF5BC8",
  },
  Haas: {
    primary:   "#B6BABD",
    secondary: "#E10600",
  },
  VCARB: {
    primary:   "#6692FF",
    secondary: "#FFFFFF",
  },
  Cadillac: {
    primary:   "#7A36FF",
    secondary: "#E6E6E6",
  },
  Audi: {
    primary:   "#F50537",
    secondary: "#C8CED4",
  },
};

const PIT_TEAMS = [ 
  { abbr: "MCL", color: "#FF8000" },
  { abbr: "FER", color: "#E10600" },
  { abbr: "MER", color: "#00D2BE" },
  { abbr: "RBR", color: "#1E41FF" },
  { abbr: "AST", color: "#006F62" },
  { abbr: "ALP", color: "#0090FF" },
  { abbr: "HASS", color: "#B6BABD" },
  { abbr: "VCARB", color: "#6692FF" },
  { abbr: "WIL", color: "#005AFF" },
  { abbr: "AUDI", color: "#F50537" },
  { abbr: "CAD", color: "#7A36FF" },
];


export default function BahrainTrack({
  selectedTurn,
  onTurnSelect,
  isSimulating,
  onLapComplete,
  onSpeedChange,
  onSectorChange,
  turnData,
  team,
  isInPit,
  garage,
  onPitStopComplete,
  onPitPhaseChange,
  onPitExit,
}) {
  const svgRef = useRef(null);
  const circuitPathRef = useRef(null);
  const pitPathRef = useRef(null);
  const frameRef = useRef(null);
  const movementSpeedRef = useRef(320);
  const lastTimeRef = useRef(null);
  const lapProgressRef = useRef(0);
  const pitProgressRef = useRef(0);
  const pitStopStartRef = useRef(null);
  const pitStopDoneRef = useRef(false);
  const pitStopFinishedRef = useRef(false);
  const pitExitDoneRef = useRef(false);
  const onLapCompleteRef = useRef(onLapComplete);
  const onPitStopCompleteRef = useRef(onPitStopComplete);
  const onPitExitRef = useRef(onPitExit);
  const onPitPhaseChangeRef = useRef(onPitPhaseChange);
  const onSpeedChangeRef = useRef(onSpeedChange);
  const onSectorChangeRef = useRef(onSectorChange);
  const turnProgressMapRef = useRef(null);
  const [carTransform, setCarTransform] = useState(
    "translate(690 530) rotate(180)");  

  const teamColors = TEAM_COLORS[team] ?? TEAM_COLORS.Ferrari;

  const findGarageProgress = (path, garageNumber) => {
    const buildingX = 300;
    const buildingWidth = 470;
    const bayWidth = buildingWidth / 11;

    const targetX = 
      buildingX + (garageNumber -0.5) * bayWidth;

    const targetY = 492;

    const totalLength = path.getTotalLength();

    let closestProgress = 0;
    let closestDistance = Infinity;

    for (let i=0; i<= 300; i++) {
      const progress = i/300;
      const point = path.getPointAtLength(progress * totalLength);
     
      const distance = Math.hypot(
        point.x -targetX,
        point.y -targetY
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestProgress = progress;
      }
     }
     return closestProgress;
  };

  const findCircuitRejoinProgress = (circuitPath, pitPath) => {
    const pitLength = pitPath.getTotalLength();
    const pitExit = pitPath.getPointAtLength(pitLength);

    const circuitLength = circuitPath.getTotalLength();

    let closestProgress = 0;
    let closestDistance = Infinity;

    for (let i = 0; i <= 500; i++) {
      const progress = i /500;

      const point =
	circuitPath.getPointAtLength(
	  progress * circuitLength
	);

      const distance = Math.hypot(
	point.x - pitExit.x,
	point.y - pitExit.y
      );

      if (distance < closestDistance) {
	closestDistance = distance;
	closestProgress = progress;
      }
    }
    return closestProgress;
  };

 useEffect(() => {
    if (isInPit) {
      pitProgressRef.current = 0;
      pitStopStartRef.current = null;
      pitStopDoneRef.current = false;
      pitStopFinishedRef.current = false;
      pitExitDoneRef.current = false;
    }
  }, [isInPit]);

  useEffect(() => {
    if (!isSimulating) {
      if(frameRef.current) {
	cancelAnimationFrame(frameRef.current);
      }

      lastTimeRef.current = null;
      return;
    }

    const circuitPath = circuitPathRef.current;
    const pitPath = pitPathRef.current;

    if (!circuitPath || !pitPath) return;

    if (!turnProgressMapRef.current) {
      turnProgressMapRef.current = buildTurnProgressMap(circuitPath);
    }

    console.log("TURN PROGRESS:", turnProgressMapRef.current);

    const path = isInPit ? pitPath : circuitPath;

    const totalLength = path.getTotalLength();
    const lapDuration = 14000;
    const pitDuration = 4000;
    const startProgress = 0.2;

    const garageProgress = isInPit
      ? findGarageProgress(pitPath, garage)
      : 1;

    const animate = (time) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }

    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;

    let pathProgress;

    if (isInPit) {
      if(!pitStopFinishedRef.current) {
        pitProgressRef.current += delta / pitDuration;

        if (pitProgressRef.current >= garageProgress) { 
          pitProgressRef.current = garageProgress;
          pathProgress = garageProgress;

          if (pitStopStartRef.current === null) {
	    pitStopStartRef.current = time;

	    if (onPitPhaseChangeRef.current) {
	      onPitPhaseChangeRef.current("PIT STOP");
	    }
	  }

	  const stoppedFor = time - pitStopStartRef.current;

	  if (stoppedFor >= 2500 && !pitStopDoneRef.current) {
	    pitStopDoneRef.current = true;
	    pitStopFinishedRef.current = true;

	    if (onPitStopCompleteRef.current) {
	      onPitStopCompleteRef.current();
	    }
	    
	    if (onPitPhaseChange) {
	      onPitPhaseChange("PIT EXIT");
	    }
	  }
        } else {
	    pathProgress = pitProgressRef.current;
        }
      } else {
        pitProgressRef.current += delta / pitDuration;
        
        pathProgress = Math.min(
          pitProgressRef.current,
	  1
	);
        if (
	  pitProgressRef.current >= 1 &&
	  !pitExitDoneRef.current
	) {
	  pitExitDoneRef.current = true;

	  const rejoinProgress = 
	    findCircuitRejoinProgress(circuitPath, pitPath);
	  
	  lapProgressRef.current = 
	    rejoinProgress - startProgress;

	  if (onPitExitRef.current) {
	    onPitExitRef.current();
	  }
	}
      }
    } else {
      const speedFactor = 0.25 +0.75  * (movementSpeedRef.current / 320);

      lapProgressRef.current -= delta / lapDuration * speedFactor;

      if (lapProgressRef.current <= -1) {
        lapProgressRef.current += 1;

        if (onLapCompleteRef.current) {
          onLapCompleteRef.current();
        }
      }

      pathProgress = 
        (startProgress + lapProgressRef.current + 1) % 1;
    }
    const distance = pathProgress * totalLength;

    const point = path.getPointAtLength(distance);

    let nearestTurn = null;
    let nearestDistance = Infinity;

    TURN_MARKERS.forEach((turn) => {
      const turnProgress = turnProgressMapRef.current[turn.number];
      let turnDistance = Math.abs(pathProgress - turnProgress);

      turnDistance = Math.min(turnDistance, 1 - turnDistance);

      if (turnDistance < nearestDistance) {
        nearestDistance = turnDistance;
        nearestTurn = turn.number;
      }
    });

    let sector

    if ( pathProgress<= 0.20 || pathProgress >= 0.84 ) {
      sector = "S1";
    } else if (pathProgress >= 0.41) {
      sector = "S2";
    }
    else {
      sector = "S3";
    }

    if (onSectorChangeRef.current) {
      onSectorChangeRef.current(sector);
    }

    const nextDistance = 
      (distance + 2) % totalLength;

    const nextPoint = 
      path.getPointAtLength(nextDistance);

    const previousDistance = 
      (distance - 8 + totalLength) % totalLength;

    const futureDistance = 
      (distance + 8) % totalLength;

    const previousPoint = 
      path.getPointAtLength(previousDistance);

    const futurePoint = 
      path.getPointAtLength(futureDistance);

    const angleBefore = Math.atan2(
      point.y -previousPoint.y,
      point.x -previousPoint.x
    );

    const angleAfter = Math.atan2(
      futurePoint.y - point.y,
      futurePoint.x - point.x
    );

    let angleDifference = Math.abs(
      (angleAfter - angleBefore) * (180 /Math.PI)
    );

    let speed;

    if (isInPit) {
      speed = 80;

      if (
	      pitStopStartRef.current !== null && !pitStopFinishedRef.current
      ) {
	      speed = 0;
      }
    } else if (nearestTurn && turnData?.[nearestTurn]){
      const turn = turnData[nearestTurn];

      const turnProgress = turnProgressMapRef.current[nearestTurn];

      let progressDifference = Math.abs(pathProgress - turnProgress);

      progressDifference = Math.min(progressDifference, 1 - progressDifference);

      const brakingZone = 0.06;
      const accelerationZone = 0.05;

      if (progressDifference < accelerationZone) {
        const ratio = progressDifference / accelerationZone;

        speed = turn.apexSpeed + (turn.exitSpeed - turn.apexSpeed) * ratio;
      } else if (progressDifference < brakingZone) {
        const ratio = (progressDifference - accelerationZone) / (brakingZone - accelerationZone);

        speed = turn.exitSpeed + (turn.entrySpeed - turn.exitSpeed) * ratio;
      } else {
        speed = 320;
      }
    } else {
      speed = 320;
    }

    if(!isInPit) {
      movementSpeedRef.current = speed;
    }

    if (onSpeedChangeRef.current) {
      onSpeedChangeRef.current(Math.round(speed));
    }

    const angle = 
      Math.atan2(
	nextPoint.y -point.y,
        nextPoint.x -point.x
      ) *
      (180 / Math.PI);

    setCarTransform(
      `translate(${point.x} ${point.y}) rotate(${angle + 180})`
    );

    frameRef.current = requestAnimationFrame(animate);
  };

  frameRef.current = requestAnimationFrame(animate);

  return () => {
    if(frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
  };
  }, [
    isSimulating,
    isInPit,
    garage,
  ]);

  useEffect(() => {
    onLapCompleteRef.current = onLapComplete;
    onPitStopCompleteRef.current = onPitStopComplete;
    onPitExitRef.current = onPitExit;
    onPitPhaseChangeRef.current = onPitPhaseChange;
    onSpeedChangeRef.current = onSpeedChange;
  }, [
   onLapComplete, 
   onPitStopComplete, 
   onPitExit,
   onPitPhaseChange,
   onSpeedChange,
   onSectorChange,
  ]);


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
	  ref={pitPathRef}
	  id="bahrainPitPath"
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
	      height="44"
	      rx="5"
	      className="garage-building"
	    />
	    <rect
	      x="300"
	      y="450"
	      width="470"
	      height="50"
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

	    <g className="garage-team-labels">
		{PIT_TEAMS.map((team, index) => {
		  const buildingX = 300;
		  const buildingY = 450;
		  const buildingWidth = 470;

		  const bayWidth= buildingWidth / 11;
		  const bayX = buildingX + index * bayWidth;

		  return (
		    <g key={team.abbr}>
		      <rect
			x={bayX}
			y={468}
			width={bayWidth}
			height={3}
			fill={team.color}
		      />

		      <text
			x={bayX + bayWidth / 2}
			y={463}
			textAnchor="middle"
			className="garage-team-text"
		      >
			{team.abbr}
		      </text>
		    </g>
		  );
		})}
	      </g>
	</g>
      </g>

      
      <path className="track-underlay" d={TRACK_PATH} />

      <path
	ref={circuitPathRef}
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
	transform={carTransform}
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
