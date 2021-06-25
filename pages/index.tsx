import Link from "next/link";

const Home: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-6 grid-rows-6 w-screen h-screen">
        <img
          src="images/pro-up.jpeg"
          alt="picture of brendon looking up to the camera"
          className="col-start-2 col-span-3 pt-5 -ml-6 opacity-60"
        />
        <img
          src="images/pro-down.jpeg"
          alt="picture of brendon looking down to the ground, away from the camera"
          className="col-start-4 col-span-3 -mt-5 opacity-60"
        />
        <img
          src="images/pro-sepia-look.jpeg"
          alt="picture of brendon posing  in front of a wall of ivy "
          className="col-start-1 col-span-4 pr-5 opacity-60"
        />
        <div className="row-start-1 col-start-5 col-span-2 -ml-5 mt-[3.55rem] text-[0.64rem] font-bold lowercase text-white opacity-50 whitespace-nowrap">
          by Brendon Zimmer
        </div>
        <div className="text-[3.5rem] leading-none font-bold text-white opacity-90 col-start-3 row-start-5 -ml-2 -mt-6 w-min">
          entirely curated music
        </div>
        <div className="col-start-3 row-start-6 mt-14 -ml-2 text-white text-lg leading-[1.2rem] font-semibold italic">
          <Link href="/playlists">
            <div className="flex w-min opacity-50 hover:cursor-pointer hover:opacity-[0.675] active:opacity-80 duration-100">
              discover
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke="currentColor"
                fill="none"
                className="w-5 h-5 transform skew-x-[-5deg]"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
