import { ref, inject } from "vue";

export const useMessage = () => {
  const timeout = ref(4000);
  const setMessage = inject(
    "useMessage",
    (message: string, timeout?: number) => {}
  );

  return {
    setMessage,
    timeout,
  };
};
