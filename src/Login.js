import "./Assets/Styles/login.css";

export default function Login() {
    return (
        <div className="login">
            <form>
                <input type="text" placeholder="Username"></input>
                <input type="text" placeholder="Password"></input>
                <button> Login </button>
            </form>
        </div>
    )
}