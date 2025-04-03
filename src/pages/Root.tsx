import AnimatedContainer from "../containers/AnimatedContainer";
import { useAppSelector } from "../store/hooks";

function Root() {
  const enter = useAppSelector(state => state.activePage)
  return (
    <AnimatedContainer isEntering={enter.In && enter.Name === 'Root'}>
      <div>
        Root
      </div>
    </AnimatedContainer>
  );
}

export default Root;

