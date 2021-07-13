import { useLoading, Oval } from "@agney/react-loading";

const Loading: React.FC = () => {
  const { containerProps, indicatorEl } = useLoading({
    loading: true,
    indicator: <Oval width="75" />,
  });

  return (
    <div className="grid place-items-center w-screen h-screen text-white/80">
      <section {...containerProps}>{indicatorEl}</section>
    </div>
  );
};

export default Loading;
