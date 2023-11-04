import HashLoader from "react-spinners/HashLoader";

const Loading = () => {
    return (
        <div>
            <HashLoader style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} color="#36d7b7" />
        </div>

    )
}

export default Loading;