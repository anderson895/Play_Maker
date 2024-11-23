import AuthenticatedHeader from "./AuthenticatedHeader";

const PlaymakersLayout = ({ content }) => {
  return (
    <div className="bg-Radial bg-[#000000] h-screen">
      <AuthenticatedHeader />
      <main className="text-[#ffffff] p-4">{content}</main>
    </div>
  );
};

export default PlaymakersLayout;
