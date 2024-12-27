import { useEffect } from 'react';

export const useClickOutside = (callback: () => Promise<void>) => {
  const handleClick = (event: MouseEvent) => {
    const selector = document.querySelector('#add-edit-modal');
    const copilotkit = document.querySelector('.copilotKitPopup');
    if (
      selector &&
      !selector.contains(event.target as HTMLElement) &&
      copilotkit &&
      !copilotkit.contains(event.target as HTMLElement)
    ) {
      callback();
    }
  };
  useEffect(() => {
    document
      .querySelector('.mantine-Modal-root')
      // @ts-ignore
      ?.addEventListener('click', handleClick);

    return () => {
      document
        .querySelector('.mantine-Modal-root')
        // @ts-ignore
        ?.removeEventListener('click', handleClick);
    };
  });
};