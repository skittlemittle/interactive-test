import { store, getContext } from "@wordpress/interactivity";
import { Simulation } from "./simulation";

store("create-block", {
  actions: {
    toggleTrails: (e) => {
      const context = getContext();
      context.boidTrails = !context.boidTrails;
      context.toggleBoidTrails(context.boidTrails);
    },
    updateLookRange: (e) => {
      const context = getContext();
      context.boidLookRange = e.target.value;
      context.setLookRange(context.boidLookRange);
    },
    updateCenteringFactor: (e) => {
      const context = getContext();
      context.setCentering(e.target.value);
    },
    updateAvoidFactor: (e) => {
      getContext().setAvoid(e.target.value);
    },
    updateCoherenceFactor: (e) => {
      getContext().setCoherence(e.target.value);
    },
    startSim: () => {
      const context = getContext();
      const {
        initBoids,
        animationLoop,
        setLookRange,
        toggleBoidTrails,
        setCentering,
        setAvoid,
        setCoherence,
      } = Simulation(
        context.canvasId,
        context.viewHeight,
        context.viewWidth,
        context.boidCount,
        context.boidLookRange,
        context.edgeBounce,
        context.boidColor,
        context.trailColor,
        context.boidTrails
      );
      initBoids();
      window.requestAnimationFrame(animationLoop);
      // jank?
      context.setLookRange = setLookRange;
      context.toggleBoidTrails = toggleBoidTrails;
      context.setCentering = setCentering;
      context.setAvoid = setAvoid;
      context.setCoherence = setCoherence;
    },
  },
});
