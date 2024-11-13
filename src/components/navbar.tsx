import { Link } from "react-router-dom";

interface NavBarProps{
    lnk: string
}

function navbar (props:NavBarProps) {
    const handleLogOut = () => {
        localStorage.clear();
        window.location.href = '/';
      }
    const handleLink = () => {
        switch(props.lnk) {
            case "home": return <Link to='/' className="link-underline-light m-2">home</Link>;
            case "login": return <Link to='/login' className="link-underline-light m-2">login</Link>;
            case "logout": return <button className="btn link-underline-light m-2" onClick={handleLogOut}>logout</button>;
        }
    }
    return ( 
        <nav className="navbar navbar-light bg-light p-2">
            <h1 className="navbar-brand">Typescript Sample Code</h1>
            <div className="float-end">
                {
                    handleLink()
                }
            </div>            
        </nav>   
    );
}

export default navbar ;