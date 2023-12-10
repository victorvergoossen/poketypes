import React, { useEffect, useRef, useState } from 'react';
import { getPokeTypes } from '../gateways/api-gateway';
import DamageRelations from '../components/damage-relations';
import { Box, Button } from '@material-ui/core';
import gsap from 'gsap';
import SearchType from '../components/search-type/search-type';
import Loader from '../components/loader-spinner';
import { DamageTypes } from './poke-types.types';
import { NextEvolutions } from '../components/next-evolutions/next-evolutions';
import { POKE_TYPES } from '../constants';
import { useLoadTypes } from '../hooks/use-load-types';

const Types = () => {
  const [type, setType] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [data, setData] = useState<DamageTypes | null>(null);
  const buttons = useRef<HTMLButtonElement[]>([]);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const { loading, setLoading } = useLoadTypes({
    type,
    contentRef,
    buttons,
    setData,
  });

  const getType = (newType: string, newName?: string) => {
    if (!contentRef.current) return;
    setLoading(true);

    if (!newName) {
      setName('')
    } else if (newName !== name) {
      setName(newName);
    }

    gsap.to(contentRef.current, {
      opacity: 0,
      duration: 0.15,
      ease: 'power2.inOut',
      onComplete: () => {
        if (newType !== type) {
          buttons.current.forEach((btn) => {
            if (btn.classList.contains('active')) {
              btn.classList.remove('active');
            } else if (btn.innerText.toLowerCase() === newType) {
              btn.classList.add('active');
            }
          });
        }

        // First reset type if new type is the same type as before, 
        // it also triggers useEffect
        setType('')
        setType(newType);
      }
    })
  };

  return (
    <div className="grid grid-cols-12 w-full h-full bg-gray-900 text-white">
      <div className="max-w-screen-xl lg:col-span-8 col-span-12 lg:col-start-3 col-start-1 px-4 pt-28 mb-14 mx-auto w-full">
        <SearchType getType={getType} />

        <p className="mb-2 mx-auto w-full">
          Or select a type:
        </p>

        <div className="grid grid-cols-12 lg:gap-x-8 gap-x-2 gap-y-2">
          {POKE_TYPES.map((res, i) => (
            <Button
              key={`type_${i}`}
              onClick={() => getType(res)}
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
                    <h2 className="font-dot text-xl text-center mb-5">
                      Selected Pokémon: <strong className="uppercase">{name}</strong>
                    </h2>
                  )}
                  <Box className={`w-auto capitalize bg-gray-800 pt-3 pb-4 rounded max-w-sm font-dot mx-auto border-4 border-white ${type}`}>
                    <h1 className="text-3xl font-bold text-center uppercase">
                      {type}
                    </h1>
                  </Box>

                  <NextEvolutions name={name} data={data} />

                  <div className="grid grid-cols-8 gap-4">
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
