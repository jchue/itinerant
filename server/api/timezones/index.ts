import { find } from 'geo-tz';

export default defineEventHandler((event) => {
  const query = useQuery(event);

  if (query.lat && query.lon) {
    return find(query.lat, query.lon);
  }

  /* No need for database yet because strings; may revisit in the future */
  const timezones = [
    'Africa/Abidjan',
    'Africa/Algiers',
    'Africa/Bissau',
    'Africa/Cairo',
    'Africa/Ceuta',
    'Africa/Johannesburg',
    'Africa/Juba',
    'Africa/Khartoum',
    'Africa/Lagos',
    'Africa/Maputo',
    'Africa/Monrovia',
    'Africa/Nairobi',
    'Africa/Ndjamena',
    'Africa/Sao_Tome',
    'Africa/Tripoli',
    'Africa/Tunis',
    'Africa/Windhoek',
    'America/Adak',
    'America/Anchorage',
    'America/Bahia_Banderas',
    'America/Barbados',
    'America/Belize',
    'America/Boise',
    'America/Cambridge_Bay',
    'America/Cancun',
    'America/Chicago',
    'America/Chihuahua',
    'America/Costa_Rica',
    'America/Danmarkshavn',
    'America/Dawson',
    'America/Dawson_Creek',
    'America/Denver',
    'America/Detroit',
    'America/Edmonton',
    'America/El_Salvador',
    'America/Fort_Nelson',
    'America/Glace_Bay',
    'America/Goose_Bay',
    'America/Grand_Turk',
    'America/Guatemala',
    'America/Halifax',
    'America/Havana',
    'America/Hermosillo',
    'America/Indiana/Indianapolis',
    'America/Indiana/Knox',
    'America/Indiana/Marengo',
    'America/Indiana/Petersburg',
    'America/Indiana/Tell_City',
    'America/Indiana/Vevay',
    'America/Indiana/Vincennes',
    'America/Indiana/Winamac',
    'America/Inuvik',
    'America/Iqaluit',
    'America/Jamaica',
    'America/Juneau',
    'America/Kentucky/Louisville',
    'America/Kentucky/Monticello',
    'America/Los_Angeles',
    'America/Managua',
    'America/Martinique',
    'America/Matamoros',
    'America/Mazatlan',
    'America/Menominee',
    'America/Merida',
    'America/Metlakatla',
    'America/Mexico_City',
    'America/Moncton',
    'America/Monterrey',
    'America/New_York',
    'America/Nipigon',
    'America/Nome',
    'America/North_Dakota/Beulah',
    'America/North_Dakota/Center',
    'America/North_Dakota/New_Salem',
    'America/Ojinaga',
    'America/Panama',
    'America/Pangnirtung',
    'America/Phoenix',
    'America/Port-au-Prince',
    'America/Puerto_Rico',
    'America/Rainy_River',
    'America/Rankin_Inlet',
    'America/Regina',
    'America/Resolute',
    'America/Santo_Domingo',
    'America/Sitka',
    'America/St_Johns',
    'America/Swift_Current',
    'America/Tegucigalpa',
    'America/Thule',
    'America/Thunder_Bay',
    'America/Tijuana',
    'America/Toronto',
    'America/Vancouver',
    'America/Whitehorse',
    'America/Winnipeg',
    'America/Yakutat',
    'America/Yellowknife',
    'Antarctica/Macquarie',
    'Asia/Amman',
    'Asia/Beirut',
    'Asia/Damascus',
    'Asia/Famagusta',
    'Asia/Gaza',
    'Asia/Hebron',
    'Asia/Hong_Kong',
    'Asia/Jakarta',
    'Asia/Jayapura',
    'Asia/Jerusalem',
    'Asia/Karachi',
    'Asia/Kolkata',
    'Asia/Macau',
    'Asia/Makassar',
    'Asia/Manila',
    'Asia/Nicosia',
    'Asia/Pontianak',
    'Asia/Pyongyang',
    'Asia/Seoul',
    'Asia/Shanghai',
    'Asia/Taipei',
    'Asia/Tokyo',
    'Atlantic/Bermuda',
    'Atlantic/Canary',
    'Atlantic/Faroe',
    'Atlantic/Madeira',
    'Atlantic/Reykjavik',
    'Australia/Adelaide',
    'Australia/Brisbane',
    'Australia/Broken_Hill',
    'Australia/Darwin',
    'Australia/Hobart',
    'Australia/Lindeman',
    'Australia/Melbourne',
    'Australia/Perth',
    'Australia/Sydney',
    'Etc/UTC',
    'Europe/Amsterdam',
    'Europe/Andorra',
    'Europe/Athens',
    'Europe/Belgrade',
    'Europe/Berlin',
    'Europe/Brussels',
    'Europe/Bucharest',
    'Europe/Budapest',
    'Europe/Chisinau',
    'Europe/Copenhagen',
    'Europe/Dublin',
    'Europe/Gibraltar',
    'Europe/Helsinki',
    'Europe/Kaliningrad',
    'Europe/Kiev',
    'Europe/Lisbon',
    'Europe/London',
    'Europe/Luxembourg',
    'Europe/Madrid',
    'Europe/Malta',
    'Europe/Monaco',
    'Europe/Moscow',
    'Europe/Oslo',
    'Europe/Paris',
    'Europe/Prague',
    'Europe/Riga',
    'Europe/Rome',
    'Europe/Simferopol',
    'Europe/Sofia',
    'Europe/Stockholm',
    'Europe/Tallinn',
    'Europe/Tirane',
    'Europe/Uzhgorod',
    'Europe/Vienna',
    'Europe/Vilnius',
    'Europe/Warsaw',
    'Europe/Zaporozhye',
    'Europe/Zurich',
    'Pacific/Auckland',
    'Pacific/Guam',
    'Pacific/Honolulu',
    'Pacific/Pago_Pago',
  ];

  return timezones;
});
