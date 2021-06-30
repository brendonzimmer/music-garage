import Link from "next/link";

const Transfer: React.FC = () => {
  return (
    <>
      <Link href="/api/login">
        <button className="px-3 py-2 bg-blue-600 text-white rounded-md">Click to transfer</button>
      </Link>
    </>
  );
};

export default Transfer;
