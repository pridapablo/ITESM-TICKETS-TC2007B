import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useTranslate } from 'react-admin';

interface TicketCardsProps {
  classification?: string;
  subclassification?: string;
  priority?: number;
  description?: string;
  resolution?: {
    whatWasDone: string;
    howWasDone: string;
    whyWasDone: string;
    closureTime: Date | null; // Use Date | null if it can be null
  };
  isDeleted?: boolean;
}

type ThemeType = 'light' | 'dark';

export default function TicketCards(props: TicketCardsProps) {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  const theme = useTheme();
  const translate = useTranslate();

  const prioridades: { [key: number]: string } = {
    0: translate('prioritys.noPriority'),
    1: translate('prioritys.veryLow'),
    2: translate('prioritys.low'),
    3: translate('prioritys.medium'),
    4: translate('prioritys.high'),
    5: translate('prioritys.veryHigh'),
  };

  const prioridadesColor: { [key: number]: string } = {
    0: 'from-gray-500 to-gray-400 shadow-gray-400',
    1: 'from-green-700 to-green-600 shadow-green-600',
    2: 'from-green-500 to-green-400 shadow-green-400',
    3: 'from-yellow-500 to-yellow-400 shadow-yellow-400',
    4: 'from-orange-500 to-orange-400 shadow-orange-400',
    5: 'from-red-500 to-red-400 shadow-red-400',
  };

  const prior = prioridades[props.priority ? props.priority : 1];
  const priorColor = prioridadesColor[props.priority ? props.priority : 1];
  //@ts-ignore
  const propsId = props.id;

  useEffect(() => {
    console.log(theme);
  }, [theme]);

  const firstSeven = propsId.substring(0, 7);
  const lastSeven = propsId.substring(propsId.length - 7);

  // Combine the first seven, a hyphen, and the last seven
  const ticketID = `${firstSeven}-${lastSeven}`;

  const [isEditing, setIsEditing] = useState(false); // Define state for editing
  const [showMore, setShowMore] = useState(false); // State to track whether to show full description

  const handleCardClick = () => {
    //@ts-ignore
    navigate(`/ticket/${props.id}`);
  };

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const descriptionToShow = showMore
    ? props.description
    : props.description?.substring(0, 30) + '...';

  return (
    <div className="flex text-center">
      <div className="p-4 sm:w-3/3 lg:w-5/5 w-full hover:scale-105 duration-500">
        <div
          className={`flex items-center justify-between p-4 rounded-lg ${
            theme.palette.mode == 'dark' ? 'bg-black' : 'bg-white border-2 border-gray-200'
          } shadow-neutral-600 shadow-md`}
        >
          <div
            className={`border ${
              theme.palette.mode == 'dark' ? 'border-black' : 'border-white'
            } w-[65%]`}
          >
            <h2 className={`${theme.palette.mode == 'dark' ? 'text-white' : 'text-black'} text-lg font-bold`}>
              {ticketID}
            </h2>
            <h3 className={`mt-2 text-xl font-bold ${theme.palette.mode == 'dark' ? 'text-white' : 'text-black'}`}>
              {props.classification}
            </h3>
            <h3 className={`text-base font-bold ${theme.palette.mode == 'dark' ? 'text-white' : 'text-black'}`}>
              {props.subclassification}
            </h3>

            <p className={`text-xs font-semibold text-gray-400 text-left`}>
              {descriptionToShow}
              {props.description && props.description.length > 30 && (
              <button
                onClick={toggleShowMore}
                className="text-sm mt-2 text-neutral-400 text-opacity-50 cursor-pointer outline-none mr-2"
              >
                {showMore ? 'Menos' : 'Más'}
              </button>
            )}
            </p>
            
            <button
              onClick={handleCardClick}
              className="text-sm mt-2 px-4 py-2 bg-green-600 text-white rounded-lg tracking-wider hover:bg-green-800 outline-none"
            >
              {role == 'user' ? translate('ra.action.edit') : translate('ra.action.resolve')}
            </button>
          </div>
          <div
            className={`bg-gradient-to-tr ${priorColor}  w-32 h-32  rounded-full shadow-2xl border-white  border-dashed border-2  flex justify-center items-center `}
          >
            <div>
              <h1 className="text-white text-2xl">{prior}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
