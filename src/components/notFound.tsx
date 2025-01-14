import Navbar from "./navbar";

const notFound = () => {
    return ( <>
        <Navbar lnk="home"/>
        <div className="d-flex justify-content-center align-items-center">
            <div className="col-md-12 text-center m-5">
                <h1>404</h1>
                <h2>Page Not Found</h2>
                <p>
                    Sorry, the page you are looking
                    for does not exist.
                </p>
            </div>
        </div>
    </> );
}
 
export default notFound;