import React, { useEffect, useRef, useState } from 'react';
import { getPokeTypes } from '../gateways/api-gateway';
import { DamageTypes } from './Types.types';
import DamageRelations from '../components/DamageRelations';
import Loader from '../components/Loader';
import { Box, Button } from '@material-ui/core';
import gsap from 'gsap';
import SearchType from "../components/SearchType";

const pokeTypes = [
  'bug',
  'dark',
  'dragon',
  'electric',
  'fairy',
  'fighting',
  'fire',
  'flying',
  'ghost',
  'grass',
  'ground',
  'ice',
  'normal',
  'poison',
  'psychic',
  'rock',
  'steel',
  'water',
];

const Types = () => {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [data, setData] = useState<DamageTypes | null>(null);
  const buttons = useRef<HTMLButtonElement[]>([]);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const animateIn = () => {
    if (!contentRef.current) return;
    contentRef.current.scrollIntoView({ behavior: 'smooth' })

    gsap.fromTo(contentRef.current, {
      opacity: 0, y: '2rem'
    }, {
      opacity: 1, y: 0, duration: 0.3, delay: 0.05, ease: 'power2.inOut'
    });
  };

  const doType = (newType: string, newName?: string) => {
    setLoading(true);
    if (!contentRef.current) return;

    if (newName) {
      setName(newName);
    } else {
      setName('')
    }

    gsap
      .to(contentRef.current, { opacity: 0, duration: 0.15, ease: 'power2.inOut' })
      .then(() => {
        buttons.current.forEach((btn) => {
          if (btn.classList.contains('active')) {
            btn.classList.remove('active');
          } else if (btn.innerText.toLowerCase() === newType) {
            btn.classList.add('active');
          }
        });

        setType(newType);
      });
  };

  useEffect(() => {
    getPokeTypes(type)
      .then((res) => {
        if (typeof res === 'undefined') return;

        setData(res);
        setLoading(false);
        animateIn();
      })
  }, [type]);

  useEffect(() => {
    document.querySelectorAll<HTMLButtonElement>('.type-button')
      ?.forEach(btn => buttons.current.push(btn));
  }, []);

  return (
    <div className="grid grid-cols-12 w-full h-full bg-gray-900 text-white">
      <div className="max-w-screen-xl lg:col-span-8 col-span-12 lg:col-start-3 col-start-1 px-4 pt-28 mb-14 mx-auto w-full">
        <SearchType doType={doType} />

        <p className="mb-2 mx-auto w-full">
          Or select a type:
        </p>

        <div className="grid grid-cols-12 lg:gap-x-8 gap-x-2 gap-y-2">
          {pokeTypes && pokeTypes.map((res, i) => (
            <Button
              key={`type_${i}`}
              onClick={() => doType(res)}
              variant="contained"
              className={`type-button button capitalize ${res}`}
            >
              {res}
            </Button>
          ))}
        </div>
      </div>

      <div className="max-w-screen-xl lg:col-span-8 col-span-12 lg:col-start-3 col-start-1 px-4 pt-4 mt-12 mb-12 mx-auto w-full">
          {loading
            ? <Loader />
            : (
              <div id="anchor" ref={contentRef} className="opacity-0">
                {type && (
                  <>
                    {name && (
                      <h2 className="font-dot text-xl text-center mb-6">
                        Selected Pokémon: <strong className="uppercase">{name}</strong>
                      </h2>
                    )}
                    <Box className={`w-auto capitalize bg-gray-800 pt-3 pb-4 rounded max-w-sm font-dot mx-auto border-4 border-white ${type}`}>
                      <h1 className="text-3xl font-bold text-center">
                        {type}
                      </h1>
                    </Box>

                    <div className="grid grid-cols-8 gap-4 mt-8">
                      <DamageRelations variant="double_damage_from" type={type} data={data} />
                      <DamageRelations variant="double_damage_to" type={type} data={data} />
                      <DamageRelations variant="half_damage_from" type={type} data={data} />
                      <DamageRelations variant="half_damage_to" type={type} data={data} />
                    </div>
                  </>
                )}
            </div>
            )
          }
        </div>
    </div>
  );
};

export default Types;
