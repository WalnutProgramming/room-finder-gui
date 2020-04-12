import { DirectiveOptions } from "vue";
import { gsap } from "gsap";

export const draw: DirectiveOptions = {
  inserted(el: any) {
    const path = el as SVGGeometryElement;
    const length = path.getTotalLength();
    // Clear any previous transition
    path.style.transition = path.style.webkitTransition = "none";
    // Set up the starting positions
    path.style.strokeDasharray = `${length} ${length}`;
    // path.style.strokeDashoffset = `${length}`;
    // // Trigger a layout so styles are calculated & the browser
    // // picks up the starting position before animating
    // path.getBoundingClientRect();
    // // Define our transition
    // path.style.transition = path.style.webkitTransition =
    //   "stroke-dashoffset 0.5s ease-in-out";
    // // Go!
    // path.style.strokeDashoffset = "0";
    gsap.fromTo(
      path.style,
      { strokeDashoffset: length },
      {
        strokeDashoffset: 0,
        onComplete() {
          path.style.strokeDasharray = "";
        },
      }
    );
  },
};
