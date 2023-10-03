import { useRive } from "@rive-app/react-canvas";

const Rive = () => {
  const { RiveComponent } = useRive({
    src: "cat.riv",
    autoplay: true,
  });
  return <RiveComponent />;
};

export default Rive;
