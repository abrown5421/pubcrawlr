import AnimatedContainer from "../containers/AnimatedContainer";
import { useAppSelector } from "../store/hooks";

function Dashboard() {
  const enter = useAppSelector(state => state.activePage)
  
  return (
    <AnimatedContainer isEntering={enter.In && enter.Name === 'Dashboard'}>
      <div>
        Dashboard
      </div>
    </AnimatedContainer>
  );
}

export default Dashboard;

