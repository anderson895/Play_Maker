import { playmakersLogo } from "../../assets";
const Header = ({ title }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <h1 className="text-xl font-bold text-[#5C1B33]">{title}</h1>
      <div className="flex items-center space-x-4">
        <img
          src={playmakersLogo}
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
      </div>
    </header>
  );
};

export default Header;
