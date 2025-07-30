import { useParams } from "react-router-dom";
import UserMainPage from "../../components/UserMainPage/UserMainPage"; // ✅ 올바른 경로

const UserPage = () => {
    const { userId } = useParams();
    return <UserMainPage userId={userId} />;
};

export default UserPage;