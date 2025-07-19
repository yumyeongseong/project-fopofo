import { useParams } from "react-router-dom";
import UserMainPage from "../components/UserMainPage";

const UserPage = () => {
    // 👇 변수명을 App.js와 동일하게 'userId'로 수정합니다.
    const { userId } = useParams();

    // 👇 UserMainPage에 userId를 전달합니다.
    return <UserMainPage userId={userId} />;
};

export default UserPage;