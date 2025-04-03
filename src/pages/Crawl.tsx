import AnimatedContainer from "../containers/AnimatedContainer";
import { useAppSelector } from "../store/hooks";

function Crawl() {
  const enter = useAppSelector(state => state.activePage)
  
  return (
    <AnimatedContainer isEntering={enter.In && enter.Name === 'Crawl'}>
      <div>
        Crawl
      </div>
    </AnimatedContainer>
  );
}

export default Crawl;

