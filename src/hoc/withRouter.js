import { useLocation } from 'react-router-dom';

const withRouter = (Component) => (props) => {
    const location = useLocation();
    return (
    <Component
        {...props}
        location={location}
    />
    );
}

export default withRouter;