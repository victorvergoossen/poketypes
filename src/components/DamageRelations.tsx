import React from 'react';
import Box from '@material-ui/core/Box';
import { DamageTypes } from '../pages/Types.types';

interface DamageRelationsProps {
  variant: 'double_damage_from' | 'double_damage_to' | 'half_damage_from' | 'half_damage_to';
  type: string;
  data: DamageTypes | null;
}

export const DamageRelations = (props: DamageRelationsProps) => {
  const { variant, type, data } = props;

  const texts = {
    'double_damage_from': `${type.toUpperCase()} gets severely hurt by:`,
    'double_damage_to': `${type.toUpperCase()} Is super effective against:`,
    'half_damage_from': `These don't hurt ${type.toUpperCase()} much:`,
    'half_damage_to': `${type.toUpperCase()} is not very effective on:`,
  };

  const classes = {
    'double_damage_from': 'lg:col-span-2 md:col-span-4 col-span-8 lg:col-start-1 md:col-start-1 col-start-1',
    'double_damage_to': 'lg:col-span-2 md:col-span-4 col-span-8 lg:col-start-3 md:col-start-5 col-start-1',
    'half_damage_from': 'lg:col-span-2 md:col-span-4 col-span-8 lg:col-start-5 md:col-start-1 col-start-1',
    'half_damage_to': 'lg:col-span-2 md:col-span-4 col-span-8 lg:col-start-7 md:col-start-5 col-start-1'
  };

  return (
    <Box className={`${classes[variant]} whitespace-pre-line p-4 my-2 bg-gray-800 rounded`}>
      <p className="mb-1 text-sm font-semibold h-12">
        {texts[variant]}
      </p>
      <ul>
        {data?.data?.['damage_relations']?.[variant] && data?.data?.['damage_relations']?.[variant].length > 0 ? (
          <>
            {data?.data?.['damage_relations']?.[variant]?.map((res, i: number) => (
              <li
                key={`half_damage_from_${i}`}
                className={`block text-center text-sm w-full px-4 py-1 my-1 
                font-dot text-white rounded text-sm shadow-lg ${res.name}`}
              >
                {res.name}
              </li>
            ))}
          </>
        ) : (
          <li
            className={`block text-center text-sm w-full px-4 py-1 my-1 font-dot 
            rounded text-sm shadow-lg uppercase bg-gray-900 text-white`}
          >
            None
          </li>
        )}
      </ul>
    </Box>
  );
};

export default DamageRelations;
