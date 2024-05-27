declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

interface Window {
  electronAPI: {
    send: (channel: string, ...args: any[]) => void;
    receive: (channel: string, func: (...args: any[]) => void) => void;
    once: (channel: string, func: (...args: any[]) => void) => void;
  };
}
