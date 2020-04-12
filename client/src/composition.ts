import { Ref, watch, reactive, toRefs } from "@vue/composition-api";
import { gsap } from "gsap";

export function useTweened(original: Ref<number>) {
  // We can't use a ref here for weird reasons
  const tweened = reactive({ val: original.value });
  watch(original, (newVal) => gsap.to(tweened, { duration: 0.2, val: newVal }));
  return toRefs(tweened).val;
}

export function range(n: number): number[] {
  return [...Array(n).keys()];
}
