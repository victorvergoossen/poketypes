import { TweenLite, Power3 } from 'gsap';

export const ShowAlert = (text: string, duration: number = 4) => {
  const animateIn = (element: HTMLDivElement) => {
    TweenLite.fromTo(element, {
      y: '-3rem',
      opacity: 0,
    }, {
      y: 0,
      opacity: 1,
      duration: 0.25,
      ease: Power3.easeInOut
    });
  };

  const animateOut = (element: HTMLDivElement) => {
    TweenLite.to(element, {
      opacity: 0,
      y: '3rem',
      onComplete: () => newAlert.remove()
    });
  };

  const newAlert = document.createElement('div');
  newAlert.classList.add('alert');
  newAlert.innerText = text;

  document.body.appendChild(newAlert);
  animateIn(newAlert);

  setTimeout(() => {
    animateOut(newAlert)
  }, duration * 1000);
};

export default ShowAlert;
