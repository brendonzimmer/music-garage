import Link from "next/link";

const ThankYou: React.FC = () => {
  return (
    <div className="grid h-screen place-items-center">
      <div className="text-center text-3xl font-medium text-black/70">
        <h1>{"<3"}</h1>
        <p>Thank you for using my project!</p>
        <p>I hope you really enjoyed.</p>
        <p>For ideas to better the project or bugs please email me.</p>
        <Link href="/">
          <button className="px-3 py-2 mt-2 rounded-md bg-white/40 font-medium">Home</button>
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;
