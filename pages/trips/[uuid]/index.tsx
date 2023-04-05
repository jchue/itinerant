import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { format } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import { fetchWithToken } from '@/lib/fetcher';
import supabase from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';
import FlightCard from '@/components/FlightCard';
import IconButton from '@/components/IconButton';
import Loader from '@/components/Loader';
import Map from '@/components/Map';
import NotFound from '@/components/NotFound';
import PageTitle from '@/components/PageTitle';
import SecondaryButton from '@/components/SecondaryButton';
import SectionTag from '@/components/SectionTag';
import StayCard from '@/components/StayCard';
import 'material-symbols';

export default function Trip() {
  const router = useRouter();

  const [addMenuVisible, setAddMenuVisible] = useState(false);
  const [currentView, setCurrentView] = useState('agenda');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);

  const session = supabase.auth.session();

  const { data, error, isLoading } = fetchWithToken(`/api/trips/${router.query.uuid}`, session?.access_token);

  const [image, setImage] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setImage(data.image);
    }
  }, [data]);

  async function refreshImage() {
    try {
      setIsImageLoading(true);

      const { data } = await axios({
        url: `/api/trips/${router.query.uuid}/image`,
        method: 'put',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
        },
      });

      setImage(data.image);
    } catch (error) {

    } finally {
      setIsImageLoading(false);
    }
  }

  if (isLoading) {
    return (
      <Loader />
    );
  }

  if (error) {
    return (
      <NotFound />
    );
  }

  if (data) {
    return (
      <div className="mx-auto max-w-screen-md">
        <Link
          href="/trips"
          className="inline-block mb-4 text-gray-500 text-sm uppercase hover:text-gray-600"
        >
          &larr; Trips
        </Link>

        <header className="flex h-72 mb-4">

          {/* Content container */}
          <div className="bg-emerald-700 flex flex-col py-6 pl-6 rounded-l-2xl w-6/12">

            {/* Content */}
            <div className="flex-1 flex">

              {/* Trip information */}
              <div className="flex-1">
                <PageTitle addClass="mb-2 text-white">{data.name}</PageTitle>
                <span className="block text-gray-400 text-sm">{data.destination}</span>
              </div>

              {/* Trip actions */}
              <div className="pr-2 pl-3">
                <Link href={`/trips/${router.query.uuid}/edit`} title="Edit trip attributes" className="block">
                  <span className="material-symbols-sharp !text-xl text-gray-400 hover:text-white">edit</span>
                </Link>
                
                <DeleteButton
                  title="Delete trip"
                  itemType="trip"
                  itemUuid={router.query.uuid}
                  inverted
                />
              </div>
            </div>

            {/* Buttons */}
            <div>
              <div className="inline relative">
                <SecondaryButton inverted onClick={() => setAddMenuVisible(!addMenuVisible)}>
                  Add Plan
                </SecondaryButton>

                {addMenuVisible &&
                  <ul
                    className="inline-block bg-white py-2 absolute rounded
                    shadow-lg text-left top-8 right-0 z-10 w-max"
                  >
                    <li>
                      <Link
                        href={`/trips/${router.query.uuid}/addflight`}
                        className="block pl-4 pr-6 py-1 hover:bg-gray-200"
                      >
                        <span className="material-symbols-sharp pr-2 !text-xl text-gray-600">flight</span>
                        <span className="inline-block align-top mt-1.5 text-gray-700 text-sm">Flight</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={{
                          pathname: '/trips/[uuid]/addstay',
                          query: { uuid: router.query.uuid },
                        }}
                        className="block pl-4 pr-6 py-1 hover:bg-gray-200"
                      >
                        <span className="material-symbols-sharp pr-2 !text-xl text-gray-600">bed</span>
                        <span className="inline-block align-top mt-1 text-gray-700 text-sm z-10">Stay</span>
                      </Link>
                    </li>
                  </ul>
                }
              </div>

              {addMenuVisible &&
                /* Scrim */
                <div
                  onClick={() => setAddMenuVisible(!addMenuVisible)}
                  className="absolute top-0 right-0 bottom-0 left-0"
                >
                </div>
              }
            </div>  
          </div>

          {/* Image */}
          <div className="relative group overflow-hidden rounded-r-2xl w-6/12">
            {/* Scrim */}
            {isImageLoading ? (
              <div className="absolute bg-white/80 flex items-center justify-center inset-0 z-10 cursor-pointer transition-opacity">
                <span className="animate-reverse-spin material-symbols-sharp !text-[50px] text-gray-600">sync</span>
              </div>
            ) : (
              <div className="absolute bg-white/25 flex items-center justify-center inset-0 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                <span title="Get new image" className="bg-white cursor-pointer rounded-full p-4 material-symbols-sharp !text-[40px] text-gray-600 transition-shadow hover:shadow hover:shadow-white/75" onClick={refreshImage}>reset_image</span>
              </div>
            )}

            {image ? (
              <Image
                src={`${image}&q=85&w=720&fm=jpg&fit=max&crop=entropy`}
                alt=""
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                quality="80"
                className="z-0"
              />
            ) : (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <span className="material-symbols-sharp !text-[100px] text-gray-300">location_city</span>
              </div>
            )}
          </div>
        </header>
      
        {/* View toggle */}
        <div className="flex justify-end mb-4">
          <IconButton icon="view_agenda" title="Agenda View" addClass="mx-1" active={currentView === 'agenda'} onClick={() => setCurrentView('agenda')} />
          <IconButton icon="map" title="Map View" addClass="mx-1" active={currentView === 'map'} onClick={() => { setCurrentView('map'); setMapLoaded(true); }} />
        </div>

        <main className="flex">
          {
          /**
           * Agenda view
           */
          }
          {currentView === 'agenda' &&
            <div className={ 'transition-all ' + (currentView === 'agenda' ? 'w-full' : 'overflow-hidden w-0')}>
              <div className="mx-auto max-w-screen-sm">
                {Object.keys(data.events).length === 0 ? (
                  /* Blank state */
                  <div
                    className="p-6 rounded-lg text-center text-gray-500"
                  >
                    <span className="material-symbols-sharp pr-2 !text-[200px] text-gray-300">map</span>

                    <p className="mb-6">Nothing to see yet. Why don't you add a plan?</p>

                    <Link href={`/trips/${router.query.uuid}/addflight`} className="mr-2">
                      <SecondaryButton type="button" addClass="flex items-center">
                        <span className="material-symbols-sharp pr-2 !text-xl">flight</span>
                        Flight
                      </SecondaryButton>
                    </Link>

                    <Link href={`/trips/${router.query.uuid}/addstay`} className="ml-2">
                      <SecondaryButton type="button" addClass="flex items-center">
                        <span className="material-symbols-sharp pr-2 !text-xl">bed</span>
                        Stay
                      </SecondaryButton>
                    </Link>
                  </div>
                ) : (
                  <ul>
                    {Object.entries(data.events).map(([date, group]) => (
                      <li key={date}>
                        <SectionTag>
                          {format(utcToZonedTime(date, group[0].indexTimezoneName), 'EEEE, LLLL d, yyyy')}
                        </SectionTag>

                        <ul>
                          {group.map((event) => (
                            <li key={event.uuid} className="my-8">
                              {event.type === 'flight' &&
                                <Link href={`/flights/${event.uuid}`}>
                                  <FlightCard
                                    airline={event.airline}
                                    flightNumber={event.flightNumber}
                                    departureAirport={event.departureAirport.code}
                                    departureTimestamp={event.departureTimestamp}
                                    departureTimezoneName={event.departureTimezoneName}
                                    arrivalAirport={event.arrivalAirport.code}
                                    arrivalTimestamp={event.arrivalTimestamp}
                                    arrivalTimezoneName={event.arrivalTimezoneName}
                                  />
                                </Link>
                              }
                              {(event.type === 'checkin' || event.type === 'checkout') &&
                                <Link href={`/stays/${event.uuid}`}>
                                  <StayCard
                                    type={event.type}
                                    name={event.name}
                                    address={event.address}
                                    timestamp={event.indexTimestamp}
                                    timezoneName={event.indexTimezoneName}
                                  />
                                </Link>
                              }
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          }

          {
          /**
           * Map view
           * Keep track of whether map has been already loaded to reduce render count
           */
          }
          {mapLoaded &&
            <div className={'h-[60vh] overflow-hidden rounded-2xl transition-all ' + (currentView === 'map' ? 'w-full' : 'w-0')}>
              <Map geojson={data.geojson} />
            </div>
          }
        </main>
      </div>
    );
  }
}
