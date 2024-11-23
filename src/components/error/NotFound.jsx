import { playmakersLogo } from "../../assets";

const NotFound = () => {
  return (
    <section className="h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(92,27,51,0.3),rgba(92,27,51))] dark:bg-gray-900 py-20">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-[180px] text-[#B3B3B3] flex justify-center gap-5">
            4{" "}
            <img
              src={playmakersLogo}
              alt="opensea logo"
              width={160}
              height={130}
            />{" "}
            4
          </h1>

          <p className="mb-4 text-3xl tracking-tight font-bold text-white md:text-4xl dark:text-white">
            This page is lost.
          </p>
          <p className="text-[#b3b3b3]  text-[20px] mb-5">
            We&apos;ve explored deep and wide, <br /> but we can&apos;t find the
            page you were looking for.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
