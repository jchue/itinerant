import { useState } from 'react';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import { fetchWithToken } from '@/lib/fetcher';
import supabase from '@/lib/supabase';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';
import FlightCard from '@/components/FlightCard';
import Loader from '@/components/Loader';
import Map from '@/components/Map';
import NotFound from '@/components/NotFound';
import PageTitle from '@/components/PageTitle';
import SectionTag from '@/components/SectionTag';
import StayCard from '@/components/StayCard';

export default function Trip() {
  const router = useRouter();

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [addMenuVisible, setAddMenuVisible] = useState(false);

  const session = supabase.auth.session();

  const { data, error, isLoading } = fetchWithToken(`/api/trips/${router.query.uuid}`, session?.access_token);

  /**
   * Keep track of whether map has been already loaded to reduce render count
   */
  function toggleMap() {
    if (!mapLoaded) {
      setMapLoaded(true);
    }

    setMapVisible(!mapVisible);
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
      <div>
        <header className="mb-6">
          <div>
            <Link
              href="/trips"
              className="text-gray-300 text-sm uppercase hover:text-gray-400"
            >
              &larr; Trips
            </Link>
          </div>
          <div className="flex items-center">
            <PageTitle addClass="mr-2">{data.name}</PageTitle>

            <DeleteButton
              itemType="trip"
              itemUuid={router.query.uuid}
              addClass="float-left"
            />

            <Link href={`/trips/${router.query.uuid}/edit`} className="float-left">
              <span className="material-icons !text-xl text-gray-500 hover:text-gray-600">edit</span>
            </Link>

            <div className="flex-1 text-right">
              <Link href="#" onClick={toggleMap} className="cursor-pointer" title="Toggle Map">
                <span className="material-icons-outlined pr-2 !text-xl text-gray-500 hover:text-gray-600">
                  map
                </span>
              </Link>

              <div className="inline relative">
                <Link href="#" onClick={() => setAddMenuVisible(!addMenuVisible)} className="cursor-pointer">
                  <span className="material-icons pr-2 !text-xl text-gray-500 hover:text-gray-600">
                    add
                  </span>
                </Link>

                {addMenuVisible &&
                  <ul
                    className="inline-block bg-white py-2 absolute rounded
                    shadow text-left top-8 right-0 z-10 w-max"
                  >
                    <li>
                      <Link
                        href={`/trips/${router.query.uuid}/addflight`}
                        className="block pl-4 pr-6 py-1 hover:bg-gray-100"
                      >
                        <span className="material-icons pr-2 !text-xl text-gray-400">flight</span>
                        <span className="inline-block align-top mt-1.5 text-gray-500 text-sm">Flight</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={{
                          pathname: '/trips/[uuid]/addstay',
                          query: { uuid: router.query.uuid },
                        }}
                        className="block pl-4 pr-6 py-1 hover:bg-gray-100"
                      >
                        <span className="material-icons pr-2 !text-xl text-gray-400">bed</span>
                        <span className="inline-block align-top mt-1 text-gray-500 text-sm z-10">Stay</span>
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
        </header>

        <main className="clear-both flex items-stretch">
          <div className={ mapVisible ? 'flex-0 mr-4' : 'flex-1'}>
            {Object.keys(data.events).length === 0 ? (
              /* Blank state */
              <div
                className="p-6 rounded-lg text-center text-gray-500"
              >
                <span className="material-icons-outlined pr-2 !text-[200px] text-gray-200">map</span>

                <p className="mb-4">What a boring trip. Why don't you add a flight or stay?</p>

                <Link href={`/trips/${router.query.uuid}/addflight`} className="mr-2">
                  <button type="button">
                    <span className="material-icons pr-2 !text-xl text-white">flight</span>
                    <span className="mt-0.5">Flight</span>
                  </button>
                </Link>

                <Link href={`/trips/${router.query.uuid}/addstay`} className="ml-2">
                  <button type="button">
                    <span className="material-icons pr-2 !text-xl text-white">bed</span>
                    <span className="mt-0.5">Stay</span>
                  </button>
                </Link>
              </div>
            ) : (
              <ul className="max-w-screen-sm">
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

          {mapLoaded &&
            <div className={'flex-1 transition-all ' + (mapVisible ? 'max-w-full opacity-100' : 'max-w-0 opacity-0')}>
              <Map geojson={data.geojson} />
            </div>
          }
        </main>
      </div>
    );
  }
}
