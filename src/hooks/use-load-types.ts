import { MutableRefObject, useEffect, useState } from "react";
import { getPokeTypes } from "../gateways/api-gateway";
import { DamageTypes } from "../pages/poke-types.types";
import gsap from "gsap";

interface IUseLoadTypes {
  type: string;
  contentRef: MutableRefObject<HTMLDivElement | null>;
  buttons: MutableRefObject<HTMLButtonElement[]>;
  setData: (types: DamageTypes | null) => void;
}

export const useLoadTypes = ({
  type,
  contentRef,
  buttons,
  setData,
}: IUseLoadTypes) => {
  const [loading, setLoading] = useState<boolean>(false);

  const animateIn = () => {
    if (!contentRef.current) return;
    contentRef.current.scrollIntoView({ behavior: 'smooth' })

    gsap.fromTo(contentRef.current, {
      opacity: 0, y: '2rem'
    }, {
      opacity: 1, y: 0, duration: 0.3, delay: 0.05, ease: 'power2.inOut'
    });
  };

  useEffect(() => {
    const loadTypes = async () => {
      const types = await getPokeTypes(type);
      if (typeof types === 'undefined') return;

      setData(types);
      setLoading(false);
      animateIn();
    };

    loadTypes();
  }, [type]);

  useEffect(() => {
    document.querySelectorAll<HTMLButtonElement>('.type-button')
      ?.forEach(btn => buttons.current.push(btn));
  }, []);

  return { loading, setLoading };
};