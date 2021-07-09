import Link from "next/link";

const Home: React.FC = () => {
  const HEADER_UNDER_MD = (
    <div className="relative text-[3.5rem] leading-none font-bold text-white opacity-90 col-start-2 row-start-6 -ml-4 -mt-4 min-w-max sm:text-[4.25rem] sm:-mt-3 md:hidden">
      time flies...
      <div className="mt-2 flex justify-start space-x-2 w-11/12 text-white text-lg leading-[1.2rem] font-semibold italic sm:text-xl">
        <Link href="/playlists">
          <div className="flex w-min opacity-50 hover:cursor-pointer hover:opacity-[0.675] active:opacity-80 duration-100">
            discover
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              className="w-5 h-5 transform skew-x-[-5deg] sm:w-7 sm:h-7"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
        <a href="/transfer">
          <div className="flex w-min opacity-50 hover:cursor-pointer hover:opacity-[0.675] active:opacity-80 duration-100">
            transfer
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              className="w-5 h-5 transform skew-x-[-5deg] sm:w-7 sm:h-7"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </a>
      </div>
    </div>
  );

  const HEADER_MD_ABOVE = (
    <div className="hidden relative text-[4.75rem] leading-none font-bold text-white opacity-90 mt-[-15rem] md:block lg:mt-0 lg:justify-self-start xl:justify-self-center 2xl:text-[5.5rem]">
      time flies...
      <div className="mt-2 flex justify-start space-x-4 text-white text-2xl font-semibold italic lg:text-[1.75rem] 2xl:text-[2rem]">
        <Link href="/playlists">
          <div className="flex items-center w-min opacity-50 hover:cursor-pointer hover:opacity-[0.675] active:opacity-80 duration-100">
            discover
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              className="w-7 h-7 transform skew-x-[-5deg] mt-1 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
        <a href="/transfer">
          <div className="flex items-center w-min opacity-50 hover:cursor-pointer hover:opacity-[0.675] active:opacity-80 duration-100">
            transfer
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              className="w-7 h-7 transform skew-x-[-5deg] mt-1 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </a>
      </div>
    </div>
  );

  return (
    <div className="grid place-items-center min-h-screen lg:grid-cols-2">
      <div className="grid grid-cols-6 grid-rows-6 w-screen max-w-[24rem] min-h-[35.5rem] max-h-[35.5rem] xs:max-w-[25rem] md:max-h-[45rem] lg:grid-rows-5 lg:max-h-[37.5rem] xl:max-w-[30rem] xl:max-h-[45rem] 2xl:max-w-[34rem] 2xl:max-h-[50rem]">
        <div className="col-start-2 col-span-3 pt-5 -ml-6 relative">
          <img src="images/pro-up.jpeg" alt="picture of brendon looking up to the camera" className="opacity-60" />
          <div className="absolute top-[3.75rem] right-[-6.5rem] text-[0.65rem] font-bold lowercase text-white opacity-50 xs:text-[0.75rem] xs:right-[-7.5rem] xs:top-[3.5rem] sm:text-[0.85rem] sm:top-[3.25rem] sm:right-[-8.5rem] md:top-[4.75rem] lg:text-base lg:top-[23rem] xl:top-[27.75rem] 2xl:text-lg 2xl:top-[31.5rem] 2xl:right-[-9.5rem]">
            by Brendon Zimmer
          </div>
        </div>
        <img
          src="images/pro-down.jpeg"
          alt="picture of brendon looking down to the ground, away from the camera"
          className="col-start-4 col-span-3 -mt-5 opacity-60 "
        />
        <img
          src="images/pro-sepia-look.jpeg"
          alt="picture of brendon posing  in front of a wall of ivy"
          className="col-start-1 col-span-4 pr-5 opacity-60 "
        />

        {HEADER_UNDER_MD}
      </div>

      {HEADER_MD_ABOVE}
    </div>
  );
};

export default Home;
