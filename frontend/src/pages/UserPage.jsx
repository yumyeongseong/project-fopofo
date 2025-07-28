import { useParams } from "react-router-dom";
import UserMainPage from "../components/UserMainPage/UserMainPage";

const UserPage = () => {
    const { userName } = useParams(); // ⬅️ URL에서 이름 추출(createuserpage)

    return <UserMainPage userName={userName} />; // ⬅️ 넘겨줌!
};

export default UserPage;