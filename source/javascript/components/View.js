import {h} from 'preact';
import AsyncRoute from 'preact-async-route';

const Loading = () => <p class="text">Loading...</p>;;

const View = ({component, ...props}) => (
  <AsyncRoute getComponent={() => component().then(m => m.default)} loading={Loading} {...props} />
)

export default View;